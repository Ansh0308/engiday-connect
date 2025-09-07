import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOtpRequest {
  grNumber: string;
  registrationId: string;
  otpCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { grNumber, registrationId, otpCode }: VerifyOtpRequest = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('gr_number', grNumber)
      .eq('registration_id', registrationId)
      .eq('otp_code', otpCode)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (otpError || !otpRecord) {
      console.error('Invalid or expired OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark OTP as verified
    const { error: updateOtpError } = await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    if (updateOtpError) {
      console.error('Error updating OTP verification:', updateOtpError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify OTP' }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if all team members have verified their OTPs
    const { data: allOtps, error: allOtpsError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('registration_id', registrationId);

    if (allOtpsError) {
      console.error('Error checking all OTPs:', allOtpsError);
      return new Response(
        JSON.stringify({ error: 'Failed to check verification status' }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const allVerified = allOtps.every(otp => otp.verified);

    // If all OTPs are verified, update registration status
    if (allVerified) {
      const { error: updateRegistrationError } = await supabase
        .from('registrations')
        .update({ 
          otp_verified: true,
          verified: true,
          registration_status: 'confirmed',
          verification_status: 'verified'
        })
        .eq('id', registrationId);

      if (updateRegistrationError) {
        console.error('Error updating registration:', updateRegistrationError);
        return new Response(
          JSON.stringify({ error: 'Failed to update registration status' }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully',
        allVerified,
        isRegistrationComplete: allVerified
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);