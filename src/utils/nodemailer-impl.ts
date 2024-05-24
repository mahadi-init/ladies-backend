import nodemailer from "nodemailer";
import secrets from "../config/secret";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: secrets.nodemailer_email,
    pass: secrets.nodemailer_password,
  },
});

export async function nodemailerImpl(
  to: string[],
  subject: string,
  text: string,
) {
  const mailOptions = {
    from: { name: "Ladies Sign", address: secrets.nodemailer_email },
    to: to.toString(),
    subject: subject,
    text: text,
    html: "<p>Hello</p>",
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
