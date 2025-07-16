import express from "express"
import { prisma, redis } from "../app"

const router = express.Router()

// Get dashboard data
router.get("/", async (req: any, res) => {
  try {
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id";

    // Check cache first
    const cacheKey = `dashboard:${userId}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      return res.json(JSON.parse(cached))
    }

    // Get user's projects and analytics
    const [projects, analytics, teamMembers] = await Promise.all([
      prisma.project.findMany({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        include: {
          owner: true,
          members: { include: { user: true } },
          _count: { select: { tasks: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),

      prisma.analytics.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      prisma.teamMember.findMany({
        where: { userId },
        include: { team: true },
      }),
    ])

    const dashboardData = {
      projects,
      analytics,
      teamMembers,
      stats: {
        totalProjects: projects.length,
        activeProjects: projects.filter((p: any) => p.status === "ACTIVE").length,
        completedTasks: projects.reduce((acc: any, p: any) => acc + p._count.tasks, 0),
        teamSize: teamMembers.length,
      },
    }

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(dashboardData))

    return res.json(dashboardData)
  } catch (error) {
    console.error("Dashboard error:", error)
    return res.status(500).json({ error: "Internal server error" });
  }
})

// Get real-time metrics
router.get("/metrics", async (req: any, res) => {
  try {
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id";
    const metrics = await prisma.metric.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    return res.json(metrics);
  } catch (error) {
    console.error("Metrics error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create new project
router.post("/projects", async (req: any, res) => {
  try {
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id";
    const { name, description, type, settings } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        description,
        type,
        settings,
        ownerId: userId,
        status: "ACTIVE",
      },
    });
    await redis.del(`dashboard:${userId}`);
    return res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router as dashboardRouter }
