import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const resend = new Resend(Deno.env.get("re_gA3RB8Y6_GEDVXyFrpmjCzUmjrvEC1tsT"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOtpRequest {
  grNumber: string;
  registrationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { grNumber, registrationId }: SendOtpRequest = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get student details from database
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('gr_number', grNumber)
      .single();

    if (studentError || !student) {
      console.error('Student not found:', studentError);
      return new Response(
        JSON.stringify({ error: 'Student not found in database' }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database
    const { error: otpError } = await supabase
      .from('otp_verifications')
      .insert({
        gr_number: grNumber,
        registration_id: registrationId,
        otp_code: otpCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes from now
      });

    if (otpError) {
      console.error('Error storing OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send OTP via email
    const emailResponse = await resend.emails.send({
      from: "Engineer's Day Registration <onboarding@resend.dev>",
      to: [student.email],
      subject: "Engineer's Day Registration - OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Engineer's Day Registration</h2>
          <p>Dear ${student.name},</p>
          <p>Your OTP for Engineer's Day registration verification is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this registration, please ignore this email.</p>
          <br>
          <p>Best regards,<br>ICT Department, Marwadi University</p>
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        studentDetails: {
          name: student.name,
          email: student.email,
          class: student.class,
          semester: student.semester
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
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