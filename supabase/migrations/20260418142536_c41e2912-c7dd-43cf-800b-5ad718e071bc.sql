DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_passenger_id_fkey') THEN
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_sender_id_fkey') THEN
    ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_receiver_id_fkey') THEN
    ALTER TABLE public.messages ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ratings_from_user_id_fkey') THEN
    ALTER TABLE public.ratings ADD CONSTRAINT ratings_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ratings_to_user_id_fkey') THEN
    ALTER TABLE public.ratings ADD CONSTRAINT ratings_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trip_requests_publisher_id_fkey') THEN
    ALTER TABLE public.trip_requests ADD CONSTRAINT trip_requests_publisher_id_fkey FOREIGN KEY (publisher_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
NOTIFY pgrst, 'reload schema';