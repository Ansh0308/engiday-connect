-- Create students table for storing student details from Excel upload
CREATE TABLE public.students (
  gr_number VARCHAR(20) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  class TEXT NOT NULL,
  semester INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations on students table
CREATE POLICY "Allow all operations on students" 
ON public.students 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create OTP verification table
CREATE TABLE public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gr_number VARCHAR(20) NOT NULL,
  registration_id UUID NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on otp_verifications table
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations on otp_verifications
CREATE POLICY "Allow all operations on otp_verifications" 
ON public.otp_verifications 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add new columns to registrations table
ALTER TABLE public.registrations 
ADD COLUMN team_leader_gr VARCHAR(20),
ADD COLUMN team_member_grs TEXT[],
ADD COLUMN otp_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN registration_status VARCHAR(20) DEFAULT 'pending';

-- Create index for faster lookups
CREATE INDEX idx_students_gr_number ON public.students(gr_number);
CREATE INDEX idx_otp_verifications_gr_number ON public.otp_verifications(gr_number);
CREATE INDEX idx_registrations_team_leader_gr ON public.registrations(team_leader_gr);

-- Create trigger for updated_at on students table
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();