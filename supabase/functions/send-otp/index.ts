import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0"

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

async function sendEmailViaSMTP(to: string, subject: string, htmlContent: string, _otpCode: string) {
  console.log("[smtp] Starting SMTP connection to Gmail...")

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const readFrom = async (conn: Deno.Conn) => {
    const buffer = new Uint8Array(4096)
    const n = await conn.read(buffer)
    const resp = decoder.decode(buffer.subarray(0, n || 0))
    console.log("[smtp] <<", resp.trim())
    return resp
  }

  const writeTo = async (conn: Deno.Conn, command: string) => {
    console.log("[smtp] >>", command.trim())
    await conn.write(encoder.encode(command))
  }

  const expect = (resp: string, expected: string, step: string) => {
    if (!resp.includes(expected)) {
      throw new Error(`${step} failed. Expected ${expected}, got: ${resp.replaceAll("\n", " ").trim()}`)
    }
  }

  let conn: Deno.Conn | null = null
  let tlsConn: Deno.Conn | null = null

  try {
    conn = await Deno.connect({ hostname: SMTP_CONFIG.hostname, port: SMTP_CONFIG.port })
    await readFrom(conn) // greeting 220

    await writeTo(conn, "EHLO localhost\r\n")
    expect(await readFrom(conn), "250", "EHLO")

    await writeTo(conn, "STARTTLS\r\n")
    expect(await readFrom(conn), "220", "STARTTLS")

    tlsConn = await Deno.startTls(conn, { hostname: SMTP_CONFIG.hostname })

    await writeTo(tlsConn, "EHLO localhost\r\n")
    expect(await readFrom(tlsConn), "250", "EHLO after TLS")

    const authString = btoa(`\0${SMTP_CONFIG.username}\0${SMTP_CONFIG.password}`)
    await writeTo(tlsConn, `AUTH PLAIN ${authString}\r\n`)
    expect(await readFrom(tlsConn), "235", "AUTH")

    await writeTo(tlsConn, `MAIL FROM:<${SMTP_CONFIG.username}>\r\n`)
    expect(await readFrom(tlsConn), "250", "MAIL FROM")

    await writeTo(tlsConn, `RCPT TO:<${to}>\r\n`)
    expect(await readFrom(tlsConn), "250", "RCPT TO")

    await writeTo(tlsConn, "DATA\r\n")
    expect(await readFrom(tlsConn), "354", "DATA")

    const now = new Date().toUTCString()
    const message = `From: Engineer's Day ICT <${SMTP_CONFIG.username}>\r\n`
      + `To: <${to}>\r\n`
      + `Subject: ${subject}\r\n`
      + `MIME-Version: 1.0\r\n`
      + `Date: ${now}\r\n`
      + `Content-Type: text/html; charset=UTF-8\r\n`
      + `Content-Transfer-Encoding: 7bit\r\n\r\n`
      + `${htmlContent}\r\n.\r\n`

    await writeTo(tlsConn, message)
    const dataResp = await readFrom(tlsConn)
    expect(dataResp, "250", "Sending message")

    await writeTo(tlsConn, "QUIT\r\n")
    await readFrom(tlsConn) // 221

    console.log("[smtp] Email accepted by Gmail SMTP")
    return true
  } catch (error) {
    console.error("[smtp] Error while sending SMTP email:", error)
    throw error
  } finally {
    try { tlsConn?.close() } catch {}
    try { conn?.close() } catch {}
  }
}


const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { grNumber, registrationId }: SendOtpRequest = await req.json()

    console.log("[v0] Processing OTP request for GR:", grNumber)

    // Initialize Supabase client
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "")

    // Get student details from database
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("gr_number", grNumber)
      .single()

    if (studentError || !student) {
      console.error("[v0] Student not found:", studentError)
      return new Response(JSON.stringify({ error: "Student not found in database" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    console.log("[v0] Found student:", student.name, "Email:", student.email)

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("[v0] Generated OTP:", otpCode)

    // Store OTP in database
    const { error: otpError } = await supabase.from("otp_verifications").insert({
      gr_number: grNumber,
      registration_id: registrationId,
      otp_code: otpCode,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
    })

    if (otpError) {
      console.error("[v0] Error storing OTP:", otpError)
      return new Response(JSON.stringify({ error: "Failed to generate OTP" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    try {
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

      await sendEmailViaSMTP(student.email, "Engineer's Day Registration - OTP Verification", emailHtml, otpCode)

      console.log("[v0] Email sent successfully to:", student.email)
    } catch (emailError: any) {
      console.error("[v0] Gmail SMTP sending failed:", emailError)

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
    console.error("[v0] Error in send-otp function:", error)
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
