
-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.trip_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE public.booking_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
CREATE TYPE public.notification_type AS ENUM ('booking', 'message', 'trip', 'system');
CREATE TYPE public.trip_request_status AS ENUM ('active', 'matched', 'cancelled', 'expired');

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  is_driver BOOLEAN NOT NULL DEFAULT false,
  vehicle_brand TEXT,
  vehicle_model TEXT,
  vehicle_color TEXT,
  license_plate TEXT,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_trips INTEGER NOT NULL DEFAULT 0,
  whatsapp_number TEXT,
  show_whatsapp BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- USER ROLES
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TRIPS
-- =============================================
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_city TEXT NOT NULL,
  from_address TEXT,
  to_city TEXT NOT NULL,
  to_address TEXT,
  stops JSONB,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  seats_total INTEGER NOT NULL DEFAULT 4,
  seats_available INTEGER NOT NULL DEFAULT 4,
  status public.trip_status NOT NULL DEFAULT 'active',
  accepts_luggage BOOLEAN NOT NULL DEFAULT false,
  accepts_animals BOOLEAN NOT NULL DEFAULT false,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_pattern JSONB,
  return_trip_id UUID REFERENCES public.trips(id),
  estimated_arrival_time TIME,
  from_lat DOUBLE PRECISION,
  from_lng DOUBLE PRECISION,
  to_lat DOUBLE PRECISION,
  to_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active trips are viewable by everyone"
  ON public.trips FOR SELECT
  USING (true);

CREATE POLICY "Drivers can create trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can delete own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = driver_id);

CREATE INDEX idx_trips_driver ON public.trips(driver_id);
CREATE INDEX idx_trips_status_date ON public.trips(status, departure_date);
CREATE INDEX idx_trips_from_city ON public.trips USING gin(to_tsvector('french', from_city));
CREATE INDEX idx_trips_to_city ON public.trips USING gin(to_tsvector('french', to_city));

-- =============================================
-- TRIP REQUESTS
-- =============================================
CREATE TABLE public.trip_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  desired_date DATE NOT NULL,
  desired_time TIME,
  proposed_price NUMERIC(10,2),
  seats_needed INTEGER NOT NULL DEFAULT 1,
  accepts_luggage BOOLEAN NOT NULL DEFAULT false,
  accepts_animals BOOLEAN NOT NULL DEFAULT false,
  is_private BOOLEAN NOT NULL DEFAULT false,
  status public.trip_request_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active requests are viewable by everyone"
  ON public.trip_requests FOR SELECT
  USING (true);

CREATE POLICY "Users can create requests"
  ON public.trip_requests FOR INSERT
  WITH CHECK (auth.uid() = publisher_id);

CREATE POLICY "Users can update own requests"
  ON public.trip_requests FOR UPDATE
  USING (auth.uid() = publisher_id);

CREATE POLICY "Users can delete own requests"
  ON public.trip_requests FOR DELETE
  USING (auth.uid() = publisher_id);

-- =============================================
-- BOOKINGS
-- =============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.booking_status NOT NULL DEFAULT 'pending',
  seats INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  total_price NUMERIC(10,2),
  platform_fee NUMERIC(10,2),
  driver_payout NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Passengers can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = passenger_id);

CREATE POLICY "Drivers can view bookings for their trips"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = bookings.trip_id AND trips.driver_id = auth.uid()
    )
  );

CREATE POLICY "Passengers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "Drivers can update bookings for their trips"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = bookings.trip_id AND trips.driver_id = auth.uid()
    )
  );

CREATE POLICY "Passengers can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = passenger_id);

CREATE INDEX idx_bookings_trip ON public.bookings(trip_id);
CREATE INDEX idx_bookings_passenger ON public.bookings(passenger_id);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can mark messages as read"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_conversation ON public.messages(sender_id, receiver_id, created_at DESC);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type public.notification_type NOT NULL DEFAULT 'system',
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

-- =============================================
-- RATINGS
-- =============================================
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  tags TEXT[],
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, from_user_id, to_user_id)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone"
  ON public.ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can create ratings"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

CREATE INDEX idx_ratings_to_user ON public.ratings(to_user_id);

-- =============================================
-- PUSH SUBSCRIPTIONS
-- =============================================
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscriptions"
  ON public.push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trip_requests_updated_at BEFORE UPDATE ON public.trip_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update rating_avg on new rating
CREATE OR REPLACE FUNCTION public.update_rating_avg()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET rating_avg = (
    SELECT COALESCE(AVG(score), 0) FROM public.ratings WHERE to_user_id = NEW.to_user_id
  )
  WHERE id = NEW.to_user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_rating
  AFTER INSERT ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_rating_avg();

-- =============================================
-- REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =============================================
-- STORAGE
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
