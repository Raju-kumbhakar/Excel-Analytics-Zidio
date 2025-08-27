const nodemailer = require('nodemailer');

/**
 * Create a transporter if SMTP env vars are present. Otherwise, return null and we will log OTPs to console.
 */
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Send OTP to email. If SMTP is not configured, log OTP to console as a fallback for development.
 */
async function sendOtpEmail(email, code, purpose = 'login') {
  const transporter = createTransporter();
  const subject = `Your ${purpose.toUpperCase()} OTP Code`;
  const text = `Your OTP code is ${code}. It will expire in 10 minutes.`;

  if (!transporter) {
    console.log(`\n[DEV MAILER] OTP for ${email}: ${code} (purpose: ${purpose})\n`);
    return { success: true, devLogged: true };
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject,
    text,
  });
  return { success: true };
}

module.exports = { sendOtpEmail };
