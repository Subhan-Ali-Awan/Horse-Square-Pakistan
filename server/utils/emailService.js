const nodemailer = require("nodemailer");

/**
 * Create Nodemailer Transporter
 * Sender account: horsesquarepakistan@gmail.com
 */
/**
 * Create Nodemailer Transporter
 * Sender account: horsesquarepakistan@gmail.com
 */
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || "horsesquarepakistan@gmail.com";
  const rawPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || "";
  const emailPass = rawPass.trim().replace(/\s+/g, "");

  if (emailPass && emailPass !== "your_gmail_app_password_here") {
    return nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  console.log("ℹ️ [EMAIL NOTICE] EMAIL_PASS not set in server/.env. Logging emails locally to console. Set EMAIL_PASS in server/.env to send real inbox emails.");
  // Fallback json transport for development logging if Gmail App Password is not yet set
  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

/**
 * Send Automated Email from horsesquarepakistan@gmail.com
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const senderEmail = '"Horse-Square Pakistan" <horsesquarepakistan@gmail.com>';

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: senderEmail,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[AUTOMATIC EMAIL SENT FROM ${senderEmail} TO ${to}] Message ID: ${info.messageId || 'DEV-LOGGED'}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL DISPATCH ERROR] Failed to send email from horsesquarepakistan@gmail.com to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Automated Riding Trial Session Approval Email from horsesquarepakistan@gmail.com
 */
const sendRidingTrialEmail = async (trial, locationInfo, courseInfo) => {
  const subject = `🏇 AUTOMATICALLY APPROVED: Riding Trial Session & Course Curriculum - ${trial.courseTitle}`;

  const curriculumHtml = courseInfo.curriculum
    ? courseInfo.curriculum.map((c, i) => `<li style="margin-bottom: 8px; color: #334155; font-size: 13px;"><strong>Week ${i + 1}:</strong> ${c}</li>`).join("")
    : "<li>Standard Horsemanship & Riding Safety Sessions</li>";

  const html = `
    <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
      
      <!-- Header Banner -->
      <div style="background-color: #0F172A; padding: 32px 24px; text-align: center; border-bottom: 4px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.5px;">Horse-Square Pakistan</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Official Riding Academy Trial Confirmation</p>
      </div>

      <!-- Main Body -->
      <div style="padding: 28px 24px;">
        <div style="background-color: #ecfdf5; border: 1.5px solid #6ee7b7; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; text-align: center;">
          <span style="color: #047857; font-weight: 800; font-size: 15px;">⚡ TRIAL BOOKING AUTOMATICALLY APPROVED BY ADMIN</span>
        </div>

        <p style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Dear <strong>${trial.name}</strong>,</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Your trial session booking request for <strong>${trial.courseTitle}</strong> has been <strong>AUTOMATICALLY APPROVED</strong>! Below are your complete course details, fee breakdown, training syllabus, and academy location.
        </p>

        <!-- Course Summary Box -->
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 14px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0F172A; margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 800;">📋 Course & Fee Structure Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr style="border-b: 1px border #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Applicant Name:</td><td style="text-align: right; color: #0F172A; font-weight: bold;">${trial.name}</td></tr>
            <tr style="border-b: 1px border #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Course Name:</td><td style="text-align: right; color: #0F172A; font-weight: 800;">${trial.courseTitle}</td></tr>
            <tr style="border-b: 1px border #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Level:</td><td style="text-align: right; color: #b45309; font-weight: bold;">${courseInfo.badge || trial.ridingLevel}</td></tr>
            <tr style="border-b: 1px border #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Official Fee:</td><td style="text-align: right; color: #047857; font-weight: 900; font-size: 15px;">${courseInfo.fee}</td></tr>
            <tr style="border-b: 1px border #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Course Duration:</td><td style="text-align: right;">${courseInfo.duration}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Preferred Slot:</td><td style="text-align: right; font-weight: bold; color: #1e293b;">${trial.preferredSlot}</td></tr>
          </table>
        </div>

        <!-- Location Card -->
        <div style="background-color: #fffbebf5; border: 1.5px solid #fcd34d; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px; font-weight: 800;">📍 Official Riding Academy Location</h3>
          <p style="color: #78350f; font-size: 14px; margin: 0 0 4px 0; font-weight: bold;">${locationInfo.name}</p>
          <p style="color: #92400e; font-size: 12px; margin: 0 0 12px 0;">${locationInfo.address}</p>
          <a href="${locationInfo.mapsUrl}" target="_blank" style="display: inline-block; background-color: #d97706; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 10px; font-size: 12px; font-weight: bold; shadow: 0 2px 4px rgba(0,0,0,0.1);">
            🗺️ Open Google Maps Navigation Link ↗
          </a>
        </div>

        <!-- Curriculum List -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #0F172A; margin: 0 0 12px 0; font-size: 14px; font-weight: 800;">📚 Course Curriculum & Training Syllabus</h3>
          <ul style="padding-left: 20px; margin: 0;">
            ${curriculumHtml}
          </ul>
        </div>

        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 14px 18px; text-align: center; margin-bottom: 20px;">
          <p style="color: #475569; font-size: 12px; margin: 0; font-weight: 600;">
            📩 Sent automatically from <strong>horsesquarepakistan@gmail.com</strong> to <strong>${trial.email}</strong>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #0F172A; padding: 20px; text-align: center; color: #94a3b8; font-size: 11px;">
        <p style="margin: 0; font-weight: 600;">Horse-Square Pakistan Equestrian Academy • Hafizabad Stud Farm</p>
        <p style="margin: 4px 0 0 0; color: #64748b;">Sender: horsesquarepakistan@gmail.com</p>
      </div>
    </div>
  `;

  return await sendEmail({ to: trial.email, subject, html });
};

/**
 * Send Automated Newsletter Subscription Confirmation Email from horsesquarepakistan@gmail.com
 */
const sendNewsletterConfirmationEmail = async (subscriberEmail) => {
  const subject = "🎉 Welcome to Horse-Square Pakistan Newsletter! Official Subscription Confirmation";

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">HORSE-SQUARE PAKISTAN</h1>
        <p style="color: #94A3B8; margin: 6px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Official Newsletter Subscription</p>
      </div>
      
      <div style="padding: 32px 28px; color: #334155; line-height: 1.6;">
        <h2 style="color: #0F172A; font-size: 20px; margin-top: 0;">Subscription Confirmed! 🐴</h2>
        <p style="font-size: 14px; color: #475569;">
          Thank you for subscribing to the <strong>Horse-Square Pakistan</strong> newsletter with <strong>${subscriberEmail}</strong>.
        </p>
        <p style="font-size: 14px; color: #475569;">
          You are now connected directly with Pakistan's premier equestrian network. You will receive exclusive updates on:
        </p>
        
        <ul style="background-color: #F8FAFC; border-left: 4px solid #D4AF37; padding: 16px 20px 16px 36px; margin: 20px 0; border-radius: 0 12px 12px 0; font-size: 13px; color: #1E293B;">
          <li style="margin-bottom: 6px;">Verified Horse Marketplace listings & fresh breed arrivals</li>
          <li style="margin-bottom: 6px;">Live Equine Auction schedules & bidding alerts</li>
          <li style="margin-bottom: 6px;">Elite Stud Breeding Lineage & estrus timing guides</li>
          <li style="margin-bottom: 6px;">AI Vet Doctor health updates & Riding Academy courses</li>
        </ul>

        <div style="margin-top: 28px; padding: 16px; background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 12px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #92400E; font-weight: 700;">
            📩 Dispatched automatically by official servers of Horse-Square Pakistan
          </p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #B45309;">
            Official Contact Email: <strong>horsesquarepakistan@gmail.com</strong>
          </p>
        </div>
      </div>
      
      <div style="background-color: #0F172A; padding: 20px; text-align: center; color: #94A3B8; font-size: 11px;">
        <p style="margin: 0; font-weight: 600;">© ${new Date().getFullYear()} Horse-Square Pakistan Equestrian Platform</p>
        <p style="margin: 4px 0 0 0; color: #64748B;">Hafizabad, Punjab, Pakistan • Support: horsesquarepakistan@gmail.com</p>
      </div>
    </div>
  `;

  // Send confirmation email to subscriber
  const userEmailPromise = sendEmail({ to: subscriberEmail, subject, html });

  // Send notification to admin email horsesquarepakistan@gmail.com
  const adminSubject = `📩 New Newsletter Subscriber: ${subscriberEmail}`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0F172A;">
      <h2>New Newsletter Subscriber Registered</h2>
      <p>A user has subscribed to the Horse-Square Pakistan newsletter from the website footer.</p>
      <p><strong>Subscriber Email:</strong> ${subscriberEmail}</p>
      <p><strong>Official Platform Email:</strong> horsesquarepakistan@gmail.com</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</p>
    </div>
  `;
  const adminEmailPromise = sendEmail({ to: "horsesquarepakistan@gmail.com", subject: adminSubject, html: adminHtml });

  const [userResult] = await Promise.all([userEmailPromise, adminEmailPromise]);
  return userResult;
};

/**
 * Send Welcome Email from horsesquarepakistan@gmail.com when a user registers / makes an account
 */
const sendWelcomeEmail = async (user) => {
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || "Member";
  const subject = "🎉 Welcome to the Horse-Square Pakistan Family!";

  const text = `Dear ${userName},

Congratulations and welcome to the Horse-Square Pakistan family!

We are delighted to have you as part of our growing community of horse lovers, buyers, sellers, riders, and enthusiasts across Pakistan.

Your account has been successfully created, and you can now explore our platform to buy and sell horses, discover riding schools, connect with trusted breeders, and enjoy many more exciting features.

Thank you for choosing Horse-Square Pakistan. We look forward to providing you with a safe, reliable, and enjoyable experience.

If you have any questions or need assistance, our support team is always here to help.

Welcome aboard, and happy exploring!

Best Regards,
Horse-Square Pakistan Team`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
      
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">HORSE-SQUARE PAKISTAN</h1>
        <p style="color: #94A3B8; margin: 6px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Official Welcome Confirmation</p>
      </div>

      <!-- Content Body -->
      <div style="padding: 32px 28px; color: #334155; line-height: 1.7; font-size: 15px;">
        <p style="color: #0F172A; font-weight: 700; font-size: 17px; margin-top: 0;">Dear <strong>${userName}</strong>,</p>
        
        <p style="color: #334155;">Congratulations and welcome to the <strong>Horse-Square Pakistan</strong> family!</p>
        
        <p style="color: #334155;">We are delighted to have you as part of our growing community of horse lovers, buyers, sellers, riders, and enthusiasts across Pakistan.</p>
        
        <p style="color: #334155;">Your account has been successfully created, and you can now explore our platform to buy and sell horses, discover riding schools, connect with trusted breeders, and enjoy many more exciting features.</p>
        
        <p style="color: #334155;">Thank you for choosing Horse-Square Pakistan. We look forward to providing you with a safe, reliable, and enjoyable experience.</p>
        
        <p style="color: #334155;">If you have any questions or need assistance, our support team is always here to help.</p>
        
        <p style="font-weight: 700; color: #D4AF37; margin-top: 24px; font-size: 16px;">Welcome aboard, and happy exploring!</p>
        
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #1E293B;">
          <p style="margin: 0; font-weight: 700;">Best Regards,</p>
          <p style="margin: 4px 0 0 0; font-weight: 800; color: #0F172A;">Horse-Square Pakistan Team</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #0F172A; padding: 20px; text-align: center; color: #94A3B8; font-size: 11px;">
        <p style="margin: 0; font-weight: 600;">© ${new Date().getFullYear()} Horse-Square Pakistan Equestrian Platform</p>
        <p style="margin: 4px 0 0 0; color: #64748B;">Official Email: horsesquarepakistan@gmail.com • Support Desk</p>
      </div>

    </div>
  `;

  return await sendEmail({ to: user.email, subject, text, html });
};

module.exports = {
  sendEmail,
  sendRidingTrialEmail,
  sendNewsletterConfirmationEmail,
  sendWelcomeEmail,
};
