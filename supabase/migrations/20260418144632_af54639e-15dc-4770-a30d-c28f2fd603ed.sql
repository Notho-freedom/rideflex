ALTER TABLE public.trips DROP CONSTRAINT IF EXISTS trips_driver_id_fkey;
ALTER TABLE public.trips ADD CONSTRAINT trips_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_passenger_id_fkey;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS ratings_from_user_id_fkey;
ALTER TABLE public.ratings ADD CONSTRAINT ratings_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS ratings_to_user_id_fkey;
ALTER TABLE public.ratings ADD CONSTRAINT ratings_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.trip_requests DROP CONSTRAINT IF EXISTS trip_requests_publisher_id_fkey;
ALTER TABLE public.trip_requests ADD CONSTRAINT trip_requests_publisher_id_fkey FOREIGN KEY (publisher_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

NOTIFY pgrst, 'reload schema';