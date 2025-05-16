import nodemailer from 'nodemailer';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const requestData = await request.json();
    const typedFormData = {
      name: requestData.name,
      email: requestData.email,
      phone: requestData.phone || "Not provided",
      organization: requestData.organization || "Not provided",
      inquiryType: requestData["inquiry-type"],
      message: requestData.message
    };
    if (!typedFormData.name || !typedFormData.email || !typedFormData.inquiryType || !typedFormData.message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please fill out all required fields"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(typedFormData.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please enter a valid email address"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "team@bigshine-display.com",
        pass: "mdry ayxg ethi rswl"
      },
      secure: true
    });
    const formattedInquiryType = {
      quote: "Request a Quote",
      demo: "Book a Demo",
      support: "Technical Support",
      general: "General Inquiry"
    };
    const readableInquiryType = formattedInquiryType[typedFormData.inquiryType] || typedFormData.inquiryType;
    const mailOptions = {
      from: "team@bigshine-display.com",
      to: "team@bigshine-display.com",
      subject: `New Contact Form Submission: ${readableInquiryType}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Inquiry Type:</strong> ${readableInquiryType}</p>
        <p><strong>Name:</strong> ${typedFormData.name}</p>
        <p><strong>Email:</strong> ${typedFormData.email}</p>
        <p><strong>Phone:</strong> ${typedFormData.phone}</p>
        <p><strong>Organization:</strong> ${typedFormData.organization}</p>
        <h3>Message:</h3>
        <p>${typedFormData.message.replace(/\n/g, "<br>")}</p>
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
    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been sent successfully!"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "There was an error sending your message. Please try again later."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
