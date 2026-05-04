ALTER TABLE public.driver_availability
  ADD CONSTRAINT driver_availability_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;