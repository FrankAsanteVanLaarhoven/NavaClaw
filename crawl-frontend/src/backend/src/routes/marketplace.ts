import express from "express"
import { Request, Response } from "express"

const router = express.Router()

// Get marketplace items
router.get("/", async (req: Request, res: Response) => {
  res.json({
    items: [
      { id: 1, name: "Data Connector Pro", type: "connector", price: 99.99 },
      { id: 2, name: "Analytics Template", type: "template", price: 49.99 },
      { id: 3, name: "Custom Dashboard", type: "dashboard", price: 199.99 }
    ]
  })
})

// Get marketplace item by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params
  res.json({
    id: parseInt(id),
    name: "Data Connector Pro",
    type: "connector",
    price: 99.99,
    description: "Advanced data connector with multiple source support",
    features: ["Real-time sync", "Multiple formats", "API support"]
  })
})

export { router as marketplaceRouter } 