import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY,
  },
});

const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2 style="color:#007BFF;">New Message from Portfolio</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <blockquote>${userMessage}</blockquote>
  </div>
`;

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_ADDRESS}>`,
      to: process.env.EMAIL_ADDRESS,
      subject: `New Message from ${name}`,
      html: generateEmailTemplate(name, email, message),
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}
