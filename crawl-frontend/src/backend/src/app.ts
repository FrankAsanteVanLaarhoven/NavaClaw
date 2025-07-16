import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { createServer } from "http"
import { Server } from "socket.io"
import { PrismaClient } from "@prisma/client"
import Redis from "ioredis"
import { authRouter } from "./routes/auth"
import { dashboardRouter } from "./routes/dashboard"
import { connectorsRouter } from "./routes/connectors"
import { aiRouter } from "./routes/ai"
import { teamRouter } from "./routes/team"
import { visualizationRouter } from "./routes/visualization"
import { marketplaceRouter } from "./routes/marketplace"
import { crawlerRouter } from "./routes/crawler"
import { errorHandler } from "./middleware/errorHandler"
import { authMiddleware } from "./middleware/auth"

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Database and Cache
export const prisma = new PrismaClient()
export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/dashboard", authMiddleware, dashboardRouter)
app.use("/api/connectors", authMiddleware, connectorsRouter)
app.use("/api/ai", authMiddleware, aiRouter)
app.use("/api/team", authMiddleware, teamRouter)
app.use("/api/visualization", authMiddleware, visualizationRouter)
app.use("/api/marketplace", authMiddleware, marketplaceRouter)
app.use("/api/crawler", crawlerRouter)

// WebSocket for real-time updates
io.use((socket, next) => {
  // Add authentication middleware for WebSocket
  const token = socket.handshake.auth.token
  // Verify JWT token here
  next()
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-dashboard", (dashboardId) => {
    socket.join(`dashboard-${dashboardId}`)
  })

  socket.on("data-update", (data) => {
    socket.to(`dashboard-${data.dashboardId}`).emit("real-time-update", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }
