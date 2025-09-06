import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0"
import { Deno } from "https://deno.land/std@0.190.0/runtime.ts" // Declaring Deno variable

const resend = new Resend(Deno.env.get("re_gA3RB8Y6_GEDVXyFrpmjCzUmjrvEC1tsT"))

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface SendOtpRequest {
  grNumber: string
  registrationId: string
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { grNumber, registrationId }: SendOtpRequest = await req.json()

    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set")
      return new Response(JSON.stringify({ error: "Email service not configured. Please contact administrator." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    // Initialize Supabase client
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "")

    // Get student details from database
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("gr_number", grNumber)
      .single()

    if (studentError || !student) {
      console.error("Student not found:", studentError)
      return new Response(JSON.stringify({ error: "Student not found in database" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in database
    const { error: otpError } = await supabase.from("otp_verifications").insert({
      gr_number: grNumber,
      registration_id: registrationId,
      otp_code: otpCode,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
    })

    if (otpError) {
      console.error("Error storing OTP:", otpError)
      return new Response(JSON.stringify({ error: "Failed to generate OTP" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    // Send OTP via email
    try {
      const emailResponse = await resend.emails.send({
        from: "Engineer's Day Registration <noreply@marwadiuniversity.ac.in>", // Use university domain instead of resend.dev
        to: [student.email],
        subject: "Engineer's Day Registration - OTP Verification",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af; margin: 0;">Engineer's Day Registration</h1>
              <p style="color: #6b7280; margin: 5px 0;">Marwadi University</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h2 style="color: white; margin: 0 0 10px 0;">Your Verification Code</h2>
              <div style="background-color: white; padding: 15px; border-radius: 8px; display: inline-block; margin: 10px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 3px;">${otpCode}</span>
              </div>
              <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 14px;">Valid for 10 minutes</p>
            </div>

            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Dear ${student.name},</strong></p>
              <p style="margin: 0 0 10px 0;">Please use the above verification code to complete your Engineer's Day registration.</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">If you didn't request this registration, please ignore this email.</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong>ICT Department, Marwadi University</strong>
              </p>
            </div>
          </div>
        `,
      })

      console.log("Email send attempt:", {
        to: student.email,
        grNumber: grNumber,
        emailId: emailResponse.data?.id,
        success: !!emailResponse.data,
      })

      if (emailResponse.error) {
        console.error("Resend API error:", emailResponse.error)
        return new Response(
          JSON.stringify({
            error: "Failed to send OTP email. Please check your email address or try again later.",
            details: emailResponse.error.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        )
      }
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError)

      return new Response(
        JSON.stringify({
          error: "Email delivery failed. This might be due to college email restrictions.",
          fallback: "Please contact the ICT Department with your GR Number for manual verification.",
          studentDetails: {
            name: student.name,
            email: student.email,
            grNumber: grNumber,
          },
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP sent successfully to your college email",
        studentDetails: {
          name: student.name,
          email: student.email,
          class: student.class,
          semester: student.semester,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    )
  } catch (error: any) {
    console.error("Error in send-otp function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  }
}

serve(handler)
