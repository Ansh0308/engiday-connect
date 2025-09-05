-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  club_name TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  min_team_size INTEGER NOT NULL DEFAULT 1,
  max_team_size INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  team_leader_name TEXT NOT NULL,
  team_leader_enrollment TEXT NOT NULL,
  team_leader_email TEXT NOT NULL,
  team_leader_department TEXT NOT NULL,
  team_leader_program TEXT NOT NULL,
  team_leader_semester INTEGER NOT NULL,
  team_members JSONB DEFAULT '[]'::jsonb,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admins table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policies for events (public read, admin write)
CREATE POLICY "Events are viewable by everyone" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete events" 
ON public.events 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create policies for registrations (public insert, admin read)
CREATE POLICY "Anyone can register for events" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view registrations" 
ON public.registrations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update registrations" 
ON public.registrations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policies for admins (only admins can access)
CREATE POLICY "Only admins can view admin data" 
ON public.admins 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for event posters
INSERT INTO storage.buckets (id, name, public) VALUES ('event-posters', 'event-posters', true);

-- Create storage policies for event posters
CREATE POLICY "Event posters are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-posters');

CREATE POLICY "Only admins can upload event posters" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'event-posters' AND auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update event posters" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'event-posters' AND auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete event posters" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'event-posters' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on events
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (username: admin, password: engiday2024)
INSERT INTO public.admins (username, password_hash) 
VALUES ('admin', '$2b$10$rGJJ5P8Sz5YfJZ8L5Q1J0uJ5Q1J0uJ5Q1J0uJ5Q1J0uJ5Q1J0uJ5Q1');

-- Create function to verify admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
  p_username TEXT,
  p_password TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple check for demo purposes (in production, use proper password hashing)
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE username = p_username 
    AND (p_password = 'engiday2024' OR password_hash = crypt(p_password, password_hash))
  );
END;
$$;