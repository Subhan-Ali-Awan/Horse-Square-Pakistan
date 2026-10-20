export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const nodemailer = (await import("nodemailer")).default;
    const { to, subject, text, html, secret } = req.body || {};

    // Authentication token to ensure only authorized requests use this dispatcher
    if (secret !== "horsesquare_email_secret_2026") {
      return res.status(401).json({ success: false, message: "Unauthorized relay access" });
    }

    const cleanTo = String(to || "").trim().toLowerCase();
    if (!cleanTo || !cleanTo.includes("@")) {
      return res.status(400).json({ success: false, message: "Invalid recipient email" });
    }

    const emailUser = (process.env.EMAIL_USER || "horsesquarepakistan@gmail.com").trim();
    const emailPass = (process.env.EMAIL_PASS || "hhidbotgwpuvwdyh").trim();

    // Use Port 465 with implicit SSL/TLS for maximum reliability on serverless functions
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log(`[VERCEL MAIL DISPATCHER] Sending to: ${cleanTo}...`);
    const info = await transporter.sendMail({
      from: '"Horse Square Pakistan" <horsesquarepakistan@gmail.com>',
      to: cleanTo,
      subject: subject || "Horse Square Pakistan Notification",
      text,
      html,
    });

    console.log(`[VERCEL MAIL DISPATCHER SUCCESS] Delivered to ${cleanTo}, Message ID: ${info.messageId}`);
    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      recipient: cleanTo,
    });
  } catch (error) {
    console.error("[VERCEL MAIL DISPATCHER ERROR]:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
