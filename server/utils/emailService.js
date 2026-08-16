const nodemailer = require("nodemailer");

/**
 * Create Nodemailer Transporter
 * Sender account: horsesquarepakistan@gmail.com
 */
const createTransporter = () => {
  const emailUser = (process.env.EMAIL_USER || "horsesquarepakistan@gmail.com").trim();
  const rawPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || "";
  const emailPass = rawPass.trim().replace(/^['"]|['"]$/g, "").replace(/\s+/g, "");

  if (emailPass && emailPass !== "your_gmail_app_password_here") {
    return nodemailer.createTransport({
      service: "gmail",
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
  const senderEmail = '"Horse Square Pakistan" <horsesquarepakistan@gmail.com>';
  const cleanTo = String(to || "").trim().toLowerCase();

  if (!cleanTo || !cleanTo.includes("@")) {
    console.error(`[EMAIL ERROR] Invalid recipient email address: "${to}"`);
    return { success: false, error: "Invalid recipient email address" };
  }

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: senderEmail,
      to: cleanTo,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [AUTOMATIC EMAIL SENT FROM ${senderEmail} TO ${cleanTo}] Message ID: ${info.messageId || 'DEV-LOGGED'}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [EMAIL DISPATCH ERROR] Failed to send email from horsesquarepakistan@gmail.com to ${cleanTo}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Welcome Email from horsesquarepakistan@gmail.com when a new user registers / logs in
 */
const sendWelcomeEmail = async (user) => {
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || "Valued Member";
  const subject = "🐎 Welcome to Horse Square Pakistan!";

  const text = `Dear ${userName},

Welcome to Horse Square Pakistan! 🐎
Congratulations on successfully creating your account. We are delighted to have you as part of our growing equestrian community.

You can now explore our platform and discover opportunities, services, and resources for the equestrian community across Pakistan.

Thank you for joining Horse Square Pakistan. We look forward to having you with us!

Kind regards,
Horse Square Pakistan
📧 horsesquarepakistan@gmail.com
Connecting Pakistan’s Equestrian Community

Stay Connected:
📸 Instagram: https://www.instagram.com/horsesquarepakistan
📘 Facebook: https://www.facebook.com/share/19cgqogZhv/`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
      
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">HORSE SQUARE PAKISTAN 🐎</h1>
        <p style="color: #94A3B8; margin: 6px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Official Welcome Confirmation</p>
      </div>

      <!-- Content Body -->
      <div style="padding: 32px 28px; color: #334155; line-height: 1.7; font-size: 15px;">
        <p style="color: #0F172A; font-weight: 700; font-size: 17px; margin-top: 0;">Dear <strong>${userName}</strong>,</p>
        
        <p style="font-size: 16px; color: #0F172A; font-weight: 600; margin-bottom: 12px;">
          Welcome to Horse Square Pakistan! 🐎
        </p>
        
        <p style="color: #334155; margin-bottom: 14px;">
          Congratulations on successfully creating your account. We are delighted to have you as part of our growing equestrian community.
        </p>
        
        <p style="color: #334155; margin-bottom: 14px;">
          You can now explore our platform and discover opportunities, services, and resources for the equestrian community across Pakistan.
        </p>
        
        <p style="color: #334155; margin-bottom: 24px;">
          Thank you for joining Horse Square Pakistan. We look forward to having you with us!
        </p>
        
        <!-- Signature & Official Contact -->
        <div style="background-color: #F8FAFC; border-left: 4px solid #D4AF37; border-radius: 0 12px 12px 0; padding: 18px 20px; margin: 24px 0;">
          <p style="margin: 0; font-weight: 700; color: #0F172A;">Kind regards,</p>
          <p style="margin: 4px 0 0 0; font-weight: 800; color: #D4AF37; font-size: 16px;">Horse Square Pakistan</p>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #475569;">
            📧 <a href="mailto:horsesquarepakistan@gmail.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">horsesquarepakistan@gmail.com</a>
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748B; font-weight: 600;">
            Connecting Pakistan’s Equestrian Community
          </p>
        </div>

        <!-- Social Media Links -->
        <div style="background-color: #FEF9C3; border: 1px solid #FDE047; border-radius: 12px; padding: 18px 20px; margin-top: 24px;">
          <p style="margin: 0 0 10px 0; font-weight: 800; color: #854D0E; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
            🌟 Stay Connected:
          </p>
          <p style="margin: 6px 0; font-size: 14px;">
            📸 <strong>Instagram:</strong> <a href="https://www.instagram.com/horsesquarepakistan" target="_blank" style="color: #c026d3; text-decoration: none; font-weight: 600;">https://www.instagram.com/horsesquarepakistan</a>
          </p>
          <p style="margin: 6px 0; font-size: 14px;">
            📘 <strong>Facebook:</strong> <a href="https://www.facebook.com/share/19cgqogZhv/" target="_blank" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">https://www.facebook.com/share/19cgqogZhv/</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #0F172A; padding: 20px; text-align: center; color: #94A3B8; font-size: 11px;">
        <p style="margin: 0; font-weight: 600;">© ${new Date().getFullYear()} Horse Square Pakistan • All Rights Reserved</p>
        <p style="margin: 4px 0 0 0; color: #64748B;">Official Email: horsesquarepakistan@gmail.com • Connecting Pakistan’s Equestrian Community</p>
      </div>

    </div>
  `;

  return await sendEmail({ to: user.email, subject, text, html });
};

/**
 * Broadcast Email to all registered users when a new listing / activity is uploaded / added
 * @param {Object} options
 * @param {string} options.type - "Marketplace Listing" | "Live Auction" | "Breeding Stallion" | "Riding Academy" | "Platform Activity"
 * @param {string} options.title - Name or title of the horse / activity
 * @param {string} [options.breed] - Breed of the horse
 * @param {string|number} [options.price] - Price or starting bid or booking fee
 * @param {string} [options.location] - City / Location in Pakistan
 * @param {string} [options.details] - Short description or specs
 * @param {string} [options.imageUrl] - Image URL of the listing
 * @param {string} [options.link] - Direct link to browse or view
 */
const broadcastNewListingEmail = async ({
  type = "Marketplace Listing",
  title = "New Horse Listing",
  breed = "",
  price = "",
  location = "",
  details = "",
  imageUrl = "",
  link = "http://localhost:5173",
}) => {
  try {
    const User = require("../models/User");
    // Fetch all active registered users with valid email
    const users = await User.find({
      email: { $exists: true, $ne: "" },
      status: { $ne: "blocked" },
    }).select("firstName lastName name email");

    if (!users || users.length === 0) {
      console.log("[BROADCAST EMAIL] No registered users found to notify.");
      return { success: true, count: 0 };
    }

    console.log(`[BROADCAST EMAIL] Preparing to notify ${users.length} registered user(s) about new ${type}: "${title}"`);

    const formattedPrice = price
      ? (typeof price === "number" ? `PKR ${price.toLocaleString()}` : (String(price).startsWith("PKR") ? price : `PKR ${price}`))
      : "";

    const emailSubject = `🐎 New Addition on Horse Square Pakistan: ${title} (${type})`;

    // Send emails in background concurrently
    const emailPromises = users.map((user) => {
      const recipientName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || "Equestrian Enthusiast";

      const plainText = `Dear ${recipientName},

A new listing / activity has just been uploaded to Horse Square Pakistan! 🐎

Activity / Listing Type: ${type}
Name: ${title}
${breed ? `Breed: ${breed}\n` : ""}${formattedPrice ? `Price / Fee: ${formattedPrice}\n` : ""}${location ? `Location: ${location}\n` : ""}${details ? `Details: ${details}\n` : ""}

Visit Horse Square Pakistan now to view the latest listing:
${link}

Kind regards,
Horse Square Pakistan
📧 horsesquarepakistan@gmail.com
Connecting Pakistan’s Equestrian Community

Stay Connected:
📸 Instagram: https://www.instagram.com/horsesquarepakistan
📘 Facebook: https://www.facebook.com/share/19cgqogZhv/`;

      const htmlContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 28px 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">HORSE SQUARE PAKISTAN 🐎</h1>
            <p style="color: #94A3B8; margin: 6px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">⚡ New Addition Notification Alert</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 28px 24px; color: #334155; line-height: 1.6;">
            <p style="color: #0F172A; font-weight: 700; font-size: 16px; margin-top: 0;">Dear <strong>${recipientName}</strong>,</p>
            
            <p style="color: #334155; font-size: 14px;">
              A brand new <strong>${type}</strong> has just been published live on <strong>Horse Square Pakistan</strong>!
            </p>

            <!-- Listing Details Card -->
            <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 14px; padding: 20px; margin: 20px 0;">
              ${imageUrl ? `<div style="text-align: center; margin-bottom: 16px;"><img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: 220px; object-fit: cover; border-radius: 10px; border: 1px solid #E2E8F0;" /></div>` : ""}
              
              <div style="display: inline-block; background-color: #D4AF37; color: #0F172A; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 8px;">
                ${type}
              </div>

              <h2 style="color: #0F172A; margin: 6px 0 12px 0; font-size: 20px; font-weight: 800;">${title}</h2>

              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
                ${breed ? `<tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 6px 0; font-weight: bold; color: #64748B;">Breed:</td><td style="text-align: right; color: #0F172A; font-weight: bold;">${breed}</td></tr>` : ""}
                ${formattedPrice ? `<tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 6px 0; font-weight: bold; color: #64748B;">Price / Fee:</td><td style="text-align: right; color: #047857; font-weight: 900; font-size: 15px;">${formattedPrice}</td></tr>` : ""}
                ${location ? `<tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 6px 0; font-weight: bold; color: #64748B;">Location:</td><td style="text-align: right; color: #0F172A; font-weight: bold;">📍 ${location}</td></tr>` : ""}
              </table>

              ${details ? `<p style="margin: 12px 0 0 0; font-size: 13px; color: #475569; line-height: 1.5; background-color: #FFFFFF; padding: 12px; border-radius: 8px; border: 1px solid #E2E8F0;">${details}</p>` : ""}
            </div>

            <!-- Call to action button -->
            <div style="text-align: center; margin: 28px 0 20px 0;">
              <a href="${link}" target="_blank" style="background: linear-gradient(135deg, #D4AF37 0%, #B89628 100%); color: #0F172A; font-weight: 800; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(212,175,55,0.3);">
                Explore Listing on Website ↗
              </a>
            </div>

            <!-- Signature -->
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 13px; color: #64748B;">
              <p style="margin: 0; font-weight: 700; color: #0F172A;">Kind regards,</p>
              <p style="margin: 2px 0 0 0; font-weight: 800; color: #D4AF37;">Horse Square Pakistan</p>
              <p style="margin: 4px 0 0 0;">📧 <a href="mailto:horsesquarepakistan@gmail.com" style="color: #2563eb; text-decoration: none;">horsesquarepakistan@gmail.com</a></p>
              <p style="margin: 2px 0 0 0;">Connecting Pakistan’s Equestrian Community</p>
            </div>

            <!-- Social Links -->
            <div style="background-color: #F8FAFC; border-radius: 10px; padding: 12px 16px; margin-top: 18px; font-size: 12px; color: #475569;">
              <span style="font-weight: bold; color: #0F172A;">Stay Connected:</span>
              <div style="margin-top: 6px;">
                📸 <a href="https://www.instagram.com/horsesquarepakistan" target="_blank" style="color: #c026d3; text-decoration: none; font-weight: 600; margin-right: 14px;">Instagram</a>
                📘 <a href="https://www.facebook.com/share/19cgqogZhv/" target="_blank" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">Facebook</a>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #0F172A; padding: 18px; text-align: center; color: #94A3B8; font-size: 11px;">
            <p style="margin: 0;">Sent automatically from official server: horsesquarepakistan@gmail.com</p>
            <p style="margin: 4px 0 0 0; color: #64748B;">© ${new Date().getFullYear()} Horse Square Pakistan • All Rights Reserved</p>
          </div>

        </div>
      `;

      return sendEmail({
        to: user.email,
        subject: emailSubject,
        text: plainText,
        html: htmlContent,
      });
    });

    // Execute all in parallel without throwing
    const results = await Promise.allSettled(emailPromises);
    const sentCount = results.filter((r) => r.status === "fulfilled" && r.value && r.value.success).length;
    console.log(`[BROADCAST EMAIL COMPLETE] Dispatched to ${sentCount}/${users.length} registered users for new ${type}.`);
    return { success: true, count: sentCount, total: users.length };
  } catch (error) {
    console.error("[BROADCAST EMAIL ERROR]:", error.message);
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

module.exports = {
  sendEmail,
  sendRidingTrialEmail,
  sendNewsletterConfirmationEmail,
  sendWelcomeEmail,
  broadcastNewListingEmail,
};
