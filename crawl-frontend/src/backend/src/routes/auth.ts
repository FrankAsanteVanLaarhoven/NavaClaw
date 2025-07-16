import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { prisma } from "../app"
import { sendEmail } from "../services/email"

const router = express.Router()

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().optional(),
  role: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Register
router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        company: data.company,
        role: data.role,
        emailVerified: false,
      },
    })

    // Generate verification token
    const verificationToken = jwt.sign({ userId: user.id, type: "email-verification" }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    })

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: "Verify your InsightsAI account",
      template: "email-verification",
      data: {
        name: user.firstName,
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
      },
    })

    return res.status(201).json({
      message: "User created successfully. Please check your email for verification.",
      userId: user.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" })

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    return res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Verify email
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    if (decoded.type !== "email-verification") {
      return res.status(400).json({ error: "Invalid token" })
    }

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailVerified: true },
    })

    return res.json({ message: "Email verified successfully" })
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token" })
  }
})

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: "If the email exists, a reset link has been sent." })
    }

    const resetToken = jwt.sign({ userId: user.id, type: "password-reset" }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    })

    await sendEmail({
      to: user.email,
      subject: "Reset your InsightsAI password",
      template: "password-reset",
      data: {
        name: user.firstName,
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
      },
    })

    return res.json({ message: "If the email exists, a reset link has been sent." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export { router as authRouter }
