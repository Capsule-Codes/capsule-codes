import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactFormSchema.parse(body);

    // Save to Supabase using service role key
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from("contact_messages")
        .insert([
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

    // Here you can add email sending logic using a service like:
    // - Resend: https://resend.com/docs/send-with-nextjs
    // - SendGrid
    // - Nodemailer
    //
    // Example with Resend (uncomment when you have RESEND_API_KEY):
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'noreply@capsulecodes.com',
      to: 'hola@capsulecodes.com',
      subject: `New Contact Message from ${validatedData.name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    });
    */

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
