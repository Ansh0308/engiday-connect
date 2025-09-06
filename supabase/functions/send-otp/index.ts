import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0"
import { Deno } from "https://deno.land/std@0.190.0/runtime.ts" // Declaring Deno variable

const SMTP_CONFIG = {
  hostname: "smtp.gmail.com",
  port: 587,
  username: "ansh.raythatha122354@marwadiuniversity.ac.in",
  password: "rhuu zjry pvxf qhvg", // App password from Google
}

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

    try {
      const client = new SmtpClient()

      await client.connectTLS({
        hostname: SMTP_CONFIG.hostname,
        port: SMTP_CONFIG.port,
        username: SMTP_CONFIG.username,
        password: SMTP_CONFIG.password,
      })

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af; margin: 0; font-size: 28px;">Engineer's Day Registration</h1>
              <p style="color: #6b7280; margin: 5px 0; font-size: 16px;">Marwadi University</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">Your Verification Code</h2>
              <div style="background-color: white; padding: 20px; border-radius: 8px; display: inline-block; margin: 15px 0;">
                <span style="font-size: 36px; font-weight: bold; color: #1e40af; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otpCode}</span>
              </div>
              <p style="color: #e5e7eb; margin: 15px 0 0 0; font-size: 14px;">⏰ Valid for 10 minutes only</p>
            </div>

            <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 15px 0; font-size: 16px;"><strong>Dear ${student.name},</strong></p>
              <p style="margin: 0 0 15px 0; line-height: 1.6;">Please use the above verification code to complete your Engineer's Day registration. This code will expire in 10 minutes for security purposes.</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                <strong>Important:</strong> If you didn't request this registration, please ignore this email. 
                If you're having trouble receiving emails, check your spam folder or contact the ICT Department.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Having trouble? Contact us at: <strong>ict@marwadiuniversity.ac.in</strong>
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong>ICT Department, Marwadi University</strong>
              </p>
            </div>
          </div>
        </div>
      `

      await client.send({
        from: SMTP_CONFIG.username,
        to: student.email,
        subject: "Engineer's Day Registration - OTP Verification",
        content: emailHtml,
        html: emailHtml,
      })

      await client.close()

      console.log("Email sent successfully via Gmail SMTP:", {
        to: student.email,
        grNumber: grNumber,
        timestamp: new Date().toISOString(),
      })
    } catch (emailError: any) {
      console.error("Gmail SMTP sending failed:", emailError)

      return new Response(
        JSON.stringify({
          error: "Email delivery failed. Please try again or contact support.",
          fallback:
            "Please contact the ICT Department at ict@marwadiuniversity.ac.in with your GR Number for manual verification.",
          debug: emailError.message,
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
        message: "OTP sent successfully to your college email via Gmail SMTP",
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
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again or contact support.",
        debug: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    )
  }
}

serve(handler)
