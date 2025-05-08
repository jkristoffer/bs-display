import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  'inquiry-type': string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get JSON data from the request
    const requestData = (await request.json()) as ContactFormData;

    // Create a typed object using our ContactFormData interface
    const typedFormData = {
      name: requestData.name,
      email: requestData.email,
      phone: requestData.phone || 'Not provided',
      organization: requestData.organization || 'Not provided',
      inquiryType: requestData['inquiry-type'],
      message: requestData.message
    };

    // Validate required fields
    if (
      !typedFormData.name ||
      !typedFormData.email ||
      !typedFormData.inquiryType ||
      !typedFormData.message
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please fill out all required fields'
        } as EmailResponse),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(typedFormData.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please enter a valid email address'
        } as EmailResponse),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.GMAIL_USER,
        pass: import.meta.env.GMAIL_APP_PASSWORD
      },
      secure: true
    });

    // Format inquiry type for better readability
    const formattedInquiryType: Record<string, string> = {
      quote: 'Request a Quote',
      demo: 'Book a Demo',
      support: 'Technical Support',
      general: 'General Inquiry'
    };

    const readableInquiryType =
      formattedInquiryType[typedFormData.inquiryType] ||
      typedFormData.inquiryType;

    // Email content
    const mailOptions = {
      from: import.meta.env.GMAIL_USER as string,
      to: import.meta.env.RECIPIENT_EMAIL as string,
      subject: `New Contact Form Submission: ${readableInquiryType}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Inquiry Type:</strong> ${readableInquiryType}</p>
        <p><strong>Name:</strong> ${typedFormData.name}</p>
        <p><strong>Email:</strong> ${typedFormData.email}</p>
        <p><strong>Phone:</strong> ${typedFormData.phone}</p>
        <p><strong>Organization:</strong> ${typedFormData.organization}</p>
        <h3>Message:</h3>
        <p>${typedFormData.message.replace(/\n/g, '<br>')}</p>
      `,
      // Add text version for email clients that don't support HTML
      text: `
        New Contact Form Submission
        ---------------------------
        Inquiry Type: ${readableInquiryType}
        Name: ${typedFormData.name}
        Email: ${typedFormData.email}
        Phone: ${typedFormData.phone}
        Organization: ${typedFormData.organization}
        
        Message:
        ${typedFormData.message}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your message has been sent successfully!'
      } as EmailResponse),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message:
          'There was an error sending your message. Please try again later.'
      } as EmailResponse),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
