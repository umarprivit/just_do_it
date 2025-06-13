import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Zoho Mail SMTP configuration
var transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

/**
 * Send a generic email
 * @param {String} to
 * @param {String} subject
 * @param {String} text
 * @param {String} html
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"Tasker Platform" <${process.env.ZOHO_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

/**
 * Send OTP email
 * @param {String} to
 * @param {String} otp
 */
export const sendOtpEmail = async (to, otp) => {
  const subject = "Your Tasker verification code";
  const text = `Your OTP code is ${otp}`;
  const html = `<p>Your OTP code is <b>${otp}</b></p>`;

  await sendEmail(to, subject, text, html);
};
