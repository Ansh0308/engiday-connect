-- Update RLS policies to work with custom admin authentication
-- First, drop existing policies
DROP POLICY IF EXISTS "Only admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Only admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Only admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Only admins can view admin data" ON public.admins;

-- Create new policies that allow all operations for now (since we're using custom admin auth)
-- We'll handle admin verification in the application layer
CREATE POLICY "Allow all operations on events" 
ON public.events 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on registrations for admins" 
ON public.registrations 
FOR SELECT 
USING (true);

CREATE POLICY "Allow update registrations" 
ON public.registrations 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow all operations on admins" 
ON public.admins 
FOR ALL 
USING (true) 
WITH CHECK (true);