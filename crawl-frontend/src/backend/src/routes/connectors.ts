import express from "express"
import { prisma } from "../app"
import { z } from "zod"
import { connectToDatabase } from "../services/connectors/database"
import { connectToAPI } from "../services/connectors/api"
import { validateConnection } from "../services/connectors/validator"

const router = express.Router()

const connectorSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["DATABASE", "API", "FILE", "STREAM"]),
  config: z.object({
    host: z.string().optional(),
    port: z.number().optional(),
    database: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    apiKey: z.string().optional(),
    endpoint: z.string().optional(),
    headers: z.record(z.string()).optional(),
  }),
  schedule: z.string().optional(),
})

// Get all connectors
router.get("/", async (req: any, res) => {
  try {
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id";

    const connectors = await prisma.connector.findMany({
      where: { userId },
      include: {
        _count: { select: { syncLogs: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return res.json(connectors)
  } catch (error) {
    console.error("Get connectors error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Create connector
router.post("/", async (req: any, res) => {
  try {
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id";
    
    const data = connectorSchema.parse(req.body)

    // Validate connection
    const isValid = await validateConnection(data.type, data.config)
    if (!isValid) {
      return res.status(400).json({ error: "Invalid connection configuration" })
    }

    const connector = await prisma.connector.create({
      data: {
        ...data,
        userId,
        status: "ACTIVE",
        lastSync: null,
        health: 100,
      },
    })

    return res.status(201).json(connector)
  } catch (error) {
    console.error("Create connector error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Test connection
router.post("/:id/test", async (req: any, res) => {
  try {
    const { id } = req.params
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id";

    const connector = await prisma.connector.findFirst({
      where: { id, userId },
    })

    if (!connector) {
      return res.status(404).json({ error: "Connector not found" })
    }

    const isValid = await validateConnection(connector.type, connector.config)

    return res.json({
      success: isValid,
      message: isValid ? "Connection successful" : "Connection failed",
    })
  } catch (error) {
    console.error("Test connection error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Sync data
router.post("/:id/sync", async (req: any, res) => {
  try {
    const { id } = req.params
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id";

    const connector = await prisma.connector.findFirst({
      where: { id, userId },
    })

    if (!connector) {
      return res.status(404).json({ error: "Connector not found" })
    }

    // Start sync process
    let syncResult
    switch (connector.type) {
      case "DATABASE":
        syncResult = await connectToDatabase(connector.config)
        break
      case "API":
        syncResult = await connectToAPI(connector.config)
        break
      default:
        throw new Error(`Unsupported connector type: ${connector.type}`)
    }

    // Log sync
    await prisma.syncLog.create({
      data: {
        connectorId: connector.id,
        status: syncResult.success ? "SUCCESS" : "FAILED",
        recordsProcessed: syncResult.recordsProcessed || 0,
        errorMessage: syncResult.error,
        duration: syncResult.duration,
      },
    })

    // Update connector
    await prisma.connector.update({
      where: { id },
      data: {
        lastSync: new Date(),
        status: syncResult.success ? "ACTIVE" : "ERROR",
        health: syncResult.success ? 100 : 50,
      },
    })

    return res.json(syncResult)
  } catch (error) {
    console.error("Sync error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export { router as connectorsRouter }
