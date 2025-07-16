import express from "express"
import { Request, Response } from "express"

const router = express.Router()

// Get visualization projects
router.get("/", async (req: Request, res: Response) => {
  res.json({
    projects: [
      { id: 1, name: "Sales Dashboard", type: "dashboard", status: "active" },
      { id: 2, name: "User Analytics", type: "chart", status: "active" },
      { id: 3, name: "Market Trends", type: "map", status: "draft" }
    ]
  })
})

// Get visualization by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params
  res.json({
    id: parseInt(id),
    name: "Sales Dashboard",
    type: "dashboard",
    status: "active",
    config: {
      charts: ["bar", "line", "pie"],
      dataSource: "sales_db",
      refreshInterval: 300
    }
  })
})

export { router as visualizationRouter } 