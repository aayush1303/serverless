const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, name, issue, message, address } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your app password or email password
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.RECEIVER_EMAIL, // Your receiver email
    subject: `Message from ${name} regarding ${issue}`,
    text: `You have received a new message from ${name} (${email}):\n\n${message}\n\nAddress: ${address}`,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email.' });
  }
}