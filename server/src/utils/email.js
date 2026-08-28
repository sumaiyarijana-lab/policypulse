const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (email, name, resetLink) => {
  const mailOptions = {
    from: `"PolicyPulse" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'PolicyPulse — Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Inter, Arial, sans-serif; background: #f8fafc; padding: 40px;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 40px rgba(0,0,0,0.06);">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 40px 48px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 0;">
              <div style="width: 40px; height: 40px; background: #16a34a; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-weight: 900; font-size: 20px;">P</span>
              </div>
              <span style="color: white; font-size: 22px; font-weight: 900; letter-spacing: -1px;">PolicyPulse</span>
            </div>
          </div>
          <div style="padding: 48px;">
            <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 12px;">Reset Your Password</h2>
            <p style="color: #64748b; line-height: 1.7; margin: 0 0 32px;">Hi ${name}, you requested a password reset for your PolicyPulse account. Click the button below to create a new password. This link expires in 1 hour.</p>
            <a href="${resetLink}" style="display: inline-block; background: #16a34a; color: white; text-decoration: none; padding: 16px 32px; border-radius: 14px; font-weight: 700; font-size: 16px;">Reset My Password</a>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 32px; line-height: 1.6;">If you didn't request this, please ignore this email. Your account is safe.</p>
          </div>
          <div style="background: #f8fafc; padding: 24px 48px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} PolicyPulse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
