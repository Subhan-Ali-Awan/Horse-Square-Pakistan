export default async function handler(req, res) {
  try {
    const nodemailer = await import("nodemailer");
    return res.status(200).json({ status: "alive", hasNodemailer: !!nodemailer });
  } catch (err) {
    return res.status(200).json({ status: "error", message: err.message, stack: err.stack });
  }
}
