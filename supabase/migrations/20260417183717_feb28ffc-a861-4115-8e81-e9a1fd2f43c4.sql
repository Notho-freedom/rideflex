DROP POLICY IF EXISTS "Anyone authenticated can insert notifications" ON public.notifications;
-- Notifications can only be inserted via SECURITY DEFINER function create_notification(), which bypasses RLS.
-- No INSERT policy = no direct insert from clients.
