import express from "express"
import { Request, Response } from "express"

const router = express.Router()

// Get team members
router.get("/", async (req: Request, res: Response) => {
  res.json({
    members: [
      { id: 1, name: "John Doe", role: "Lead Developer", avatar: "/avatars/john.jpg" },
      { id: 2, name: "Jane Smith", role: "Data Analyst", avatar: "/avatars/jane.jpg" },
      { id: 3, name: "Mike Johnson", role: "DevOps Engineer", avatar: "/avatars/mike.jpg" }
    ]
  })
})

// Get team member by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params
  res.json({
    id: parseInt(id),
    name: "John Doe",
    role: "Lead Developer",
    avatar: "/avatars/john.jpg",
    email: "john@insightsai.com",
    department: "Engineering"
  })
})

export { router as teamRouter } 