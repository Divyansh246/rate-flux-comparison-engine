const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Rate Flux Alerts" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Rate Flux! Your alert is set ⚡',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0b09; color: #e8e5e0; padding: 40px; border-radius: 12px; border: 1px solid #2e2b27;">
        <h2 style="color: #f5a623; margin-bottom: 24px;">Alert Set Successfully!</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #e8e5e0;">
          Hi there,<br><br>
          This is a confirmation that your price alert was saved successfully. 
          We are now tracking prices for you, and we will send another email directly to this inbox the moment the price drops!
        </p>
        <p style="font-size: 16px; color: #e8e5e0;">Happy hunting,<br><strong>The Rate Flux Team</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Alert email sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email. Check server logs.' });
  }
}
