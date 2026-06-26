const nodemailer = require("nodemailer");

function createTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.log("❌ SMTP environment variables are missing.");
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },

    // Prevent timeout issues
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,

    tls: {
      rejectUnauthorized: false,
    },
  });
}

async function sendOtpEmail(email, code, purpose = "login") {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error("SMTP transporter could not be created.");
  }

  // Verify SMTP connection
  try {
    await transporter.verify();
    console.log("✅ SMTP server connected successfully.");
  } catch (err) {
    console.error("❌ SMTP verification failed:", err);
    throw err;
  }

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: `Your ${purpose.toUpperCase()} OTP Code`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>Excel Analytics</h2>
        <p>Your OTP for <b>${purpose}</b> is:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:6px;
          color:#2563eb;
          margin:20px 0;">
          ${code}
        </div>

        <p>This OTP will expire in <b>10 minutes</b>.</p>

        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully.");
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
}

module.exports = {
  sendOtpEmail,
};
