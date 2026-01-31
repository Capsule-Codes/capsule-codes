import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations/contact";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactFormSchema.parse(body);

    // Save to Supabase using service role key
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from("contact_messages").insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company,
          message: validatedData.message,
          status: "unread",
        },
      ]);

      if (error) {
        console.error("Error saving contact message:", error);
        throw error;
      }
    }

    if (process.env.RESEND_API_KEY) {
      try {
        let recipientEmail = "info@capsulecodes.com";

        if (supabaseAdmin) {
          const { data: contactInfo } = await supabaseAdmin
            .from("contact_info")
            .select("email")
            .single();

          if (contactInfo?.email) {
            recipientEmail = contactInfo.email;
          }
        }

        await resend.emails.send({
          from: "messages-noreply@capsulecodes.com",
          to: recipientEmail,
          subject: `New Contact Message from ${validatedData.name}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                  .field { margin-bottom: 20px; }
                  .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
                  .value { background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #667eea; }
                  .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 3px solid #764ba2; white-space: pre-wrap; }
                  .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2 style="margin: 0;">🚀 New Contact Message</h2>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Capsule Codes - Contact Form</p>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">👤 Name:</div>
                      <div class="value">${validatedData.name}</div>
                    </div>

                    <div class="field">
                      <div class="label">📧 Email:</div>
                      <div class="value"><a href="mailto:${validatedData.email}">${validatedData.email}</a></div>
                    </div>

                    ${
                      validatedData.company
                        ? `
                    <div class="field">
                      <div class="label">🏢 Company:</div>
                      <div class="value">${validatedData.company}</div>
                    </div>
                    `
                        : ""
                    }

                    <div class="field">
                      <div class="label">💬 Message:</div>
                      <div class="message-box">${validatedData.message}</div>
                    </div>

                    <div class="footer">
                      <p>This message was sent from the Capsule Codes contact form.</p>
                      <p>Reply directly to this email to contact ${validatedData.name}.</p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
          replyTo: validatedData.email,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    }

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
