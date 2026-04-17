-- 1. Add preference columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notif_push boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notif_email boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notif_sms boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dark_mode boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'fr';

-- 2. payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  brand text NOT NULL,
  last4 text NOT NULL,
  expiry text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  stripe_payment_method_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payment methods" ON public.payment_methods
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payment methods" ON public.payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own payment methods" ON public.payment_methods
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own payment methods" ON public.payment_methods
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. identity_documents table
DO $$ BEGIN
  CREATE TYPE public.id_doc_type AS ENUM ('id_card', 'selfie', 'license', 'phone');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.id_doc_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.identity_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type public.id_doc_type NOT NULL,
  status public.id_doc_status NOT NULL DEFAULT 'pending',
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, type)
);
ALTER TABLE public.identity_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own id docs" ON public.identity_documents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own id docs" ON public.identity_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own id docs" ON public.identity_documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_identity_documents_updated_at
  BEFORE UPDATE ON public.identity_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for identity docs (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('identity-docs', 'identity-docs', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users view own identity docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'identity-docs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own identity docs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'identity-docs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own identity docs"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'identity-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. driver_availability table
CREATE TABLE IF NOT EXISTS public.driver_availability (
  user_id uuid PRIMARY KEY,
  is_available boolean NOT NULL DEFAULT false,
  lat double precision,
  lng double precision,
  radius_km integer NOT NULL DEFAULT 10,
  available_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.driver_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available drivers" ON public.driver_availability
  FOR SELECT USING (true);
CREATE POLICY "Users insert own availability" ON public.driver_availability
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own availability" ON public.driver_availability
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own availability" ON public.driver_availability
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_driver_availability_updated_at
  BEFORE UPDATE ON public.driver_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. SECURITY DEFINER helper to create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  _user_id uuid,
  _title text,
  _body text,
  _type notification_type,
  _data jsonb DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, body, type, data)
  VALUES (_user_id, _title, _body, _type, _data);
END;
$$;

-- 6. Trigger: on booking created -> notify driver
CREATE OR REPLACE FUNCTION public.on_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _driver_id uuid;
  _from text;
  _to text;
BEGIN
  SELECT driver_id, from_city, to_city INTO _driver_id, _from, _to
  FROM public.trips WHERE id = NEW.trip_id;
  IF _driver_id IS NOT NULL THEN
    PERFORM public.create_notification(
      _driver_id,
      'Nouvelle demande de réservation',
      'Un passager souhaite réserver votre trajet ' || _from || ' → ' || _to,
      'booking'::notification_type,
      jsonb_build_object('booking_id', NEW.id, 'trip_id', NEW.trip_id)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_booking_created ON public.bookings;
CREATE TRIGGER trg_on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.on_booking_created();

-- 7. Trigger: on booking status change -> manage seats + notify passenger
CREATE OR REPLACE FUNCTION public.on_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _from text;
  _to text;
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  SELECT from_city, to_city INTO _from, _to FROM public.trips WHERE id = NEW.trip_id;

  -- Accepted: decrement seats
  IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
    UPDATE public.trips
      SET seats_available = GREATEST(seats_available - NEW.seats, 0)
      WHERE id = NEW.trip_id;
    PERFORM public.create_notification(
      NEW.passenger_id,
      'Réservation acceptée',
      'Votre réservation pour ' || _from || ' → ' || _to || ' a été acceptée.',
      'booking'::notification_type,
      jsonb_build_object('booking_id', NEW.id, 'trip_id', NEW.trip_id)
    );
  END IF;

  -- Rejected
  IF NEW.status = 'rejected' AND OLD.status <> 'rejected' THEN
    PERFORM public.create_notification(
      NEW.passenger_id,
      'Réservation refusée',
      'Votre réservation pour ' || _from || ' → ' || _to || ' a été refusée.',
      'booking'::notification_type,
      jsonb_build_object('booking_id', NEW.id, 'trip_id', NEW.trip_id)
    );
  END IF;

  -- Cancelled from accepted -> restore seats
  IF NEW.status = 'cancelled' AND OLD.status = 'accepted' THEN
    UPDATE public.trips
      SET seats_available = seats_available + NEW.seats
      WHERE id = NEW.trip_id;
    PERFORM public.create_notification(
      NEW.passenger_id,
      'Réservation annulée',
      'Votre réservation pour ' || _from || ' → ' || _to || ' a été annulée.',
      'booking'::notification_type,
      jsonb_build_object('booking_id', NEW.id, 'trip_id', NEW.trip_id)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_booking_status_change ON public.bookings;
CREATE TRIGGER trg_on_booking_status_change
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.on_booking_status_change();

-- 8. Trigger: on message created -> notify receiver
CREATE OR REPLACE FUNCTION public.on_message_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sender_name text;
BEGIN
  SELECT COALESCE(full_name, 'Quelqu''un') INTO _sender_name
  FROM public.profiles WHERE id = NEW.sender_id;
  PERFORM public.create_notification(
    NEW.receiver_id,
    'Nouveau message',
    _sender_name || ' : ' || LEFT(NEW.content, 80),
    'message'::notification_type,
    jsonb_build_object('sender_id', NEW.sender_id, 'message_id', NEW.id)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_message_created ON public.messages;
CREATE TRIGGER trg_on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.on_message_created();

-- 9. Enable pg_net for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 10. Trigger: on notification insert -> call push edge function
CREATE OR REPLACE FUNCTION public.notify_push_on_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM extensions.http_post(
    url := 'https://jbsjnialbijnnhlyobrv.supabase.co/functions/v1/send-push-notification',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'user_id', NEW.user_id,
      'title', NEW.title,
      'body', NEW.body,
      'data', NEW.data
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_push ON public.notifications;
CREATE TRIGGER trg_notify_push
  AFTER INSERT ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.notify_push_on_notification();

-- 11. Allow notifications insert via SECURITY DEFINER function (loosen RLS for triggers)
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "Anyone authenticated can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);
