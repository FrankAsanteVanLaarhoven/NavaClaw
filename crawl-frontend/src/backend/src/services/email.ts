import nodemailer from "nodemailer"
import { readFileSync } from "fs"
import { join } from "path"
import Handlebars from "handlebars"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

export async function sendEmail({ to, subject, template, data }: EmailOptions) {
  try {
    // Load template
    const templatePath = join(__dirname, "../templates", `${template}.hbs`)
    const templateSource = readFileSync(templatePath, "utf8")
    const compiledTemplate = Handlebars.compile(templateSource)

    const html = compiledTemplate(data)

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    })

    console.log(`Email sent to ${to}`)
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}
