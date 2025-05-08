import nodemailer from 'nodemailer';

export async function post({ request }) {
  try {
    // Get form data from the request
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || 'Not provided';
    const organization = formData.get('organization') || 'Not provided';
    const inquiryType = formData.get('inquiry-type');
    const message = formData.get('message');

    // Validate required fields
    if (!name || !email || !inquiryType || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please fill out all required fields',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please enter a valid email address',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASS,
      },
      secure: true,
    });

    // Format inquiry type for better readability
    const formattedInquiryType = {
      quote: 'Request a Quote',
      demo: 'Book a Demo',
      support: 'Technical Support',
      general: 'General Inquiry',
    }[inquiryType] || inquiryType;

    // Email content
    const mailOptions = {
      from: import.meta.env.EMAIL_USER,
      to: import.meta.env.EMAIL_RECIPIENT || 'info@bsdisplay.com', // Use configured recipient or default
      subject: `New Contact Form Submission: ${formattedInquiryType}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Inquiry Type:</strong> ${formattedInquiryType}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      // Add text version for email clients that don't support HTML
      text: `
        New Contact Form Submission
        ---------------------------
        Inquiry Type: ${formattedInquiryType}
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Organization: ${organization}
        
        Message:
        ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your message has been sent successfully!',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'There was an error sending your message. Please try again later.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
