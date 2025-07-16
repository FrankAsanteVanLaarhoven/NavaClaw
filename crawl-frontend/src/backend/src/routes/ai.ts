import express from "express"
import { OpenAI } from "openai"
import { Anthropic } from "@anthropic-ai/sdk"
import { prisma } from "../app"
import { z } from "zod"

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const chatSchema = z.object({
  message: z.string().min(1),
  model: z.enum(["gpt-4", "gpt-3.5-turbo", "claude-3-opus", "claude-3-sonnet"]),
  context: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
})

// Chat with AI
router.post("/chat", async (req, res) => {
  try {
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id"
    const data = chatSchema.parse(req.body)

    let response: string | undefined

    if (data.model.startsWith("gpt")) {
      const completion = await openai.chat.completions.create({
        model: data.model,
        messages: [...(data.context || []), { role: "user", content: data.message }],
        max_tokens: 1000,
        temperature: 0.7,
      })

      response = completion.choices[0].message.content || ""
    } else if (data.model.startsWith("claude")) {
      const completion = await anthropic.messages.create({
        model: data.model,
        max_tokens: 1000,
        messages: [...(data.context || []), { role: "user", content: data.message }],
      })

      // Type guard to check if content exists and has text property
      if (completion.content && completion.content.length > 0) {
        const firstContent = completion.content[0]
        if ('text' in firstContent && typeof firstContent.text === 'string') {
          response = firstContent.text
        }
      }
    }

    if (!response) {
      return res.status(500).json({ error: "Failed to generate response" })
    }

    // Save conversation
    await prisma.conversation.create({
      data: {
        userId,
        model: data.model,
        userMessage: data.message,
        aiResponse: response,
      },
    })

    res.json({ response })
  } catch (error) {
    console.error("AI chat error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Generate insights
router.post("/insights", async (req, res) => {
  try {
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id"
    const { data, type } = req.body

    const prompt = `Analyze the following ${type} data and provide key insights:
    
    ${JSON.stringify(data, null, 2)}
    
    Please provide:
    1. Key trends and patterns
    2. Notable anomalies or outliers
    3. Actionable recommendations
    4. Potential risks or opportunities
    
    Format the response as structured JSON with clear sections.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.3,
    })

    const insights = completion.choices[0].message.content

    if (!insights) {
      return res.status(500).json({ error: "Failed to generate insights" })
    }

    // Save insights
    await prisma.insight.create({
      data: {
        userId,
        type,
        data: JSON.stringify(data),
        insights,
        model: "gpt-4",
      },
    })

    try {
      const parsedInsights = JSON.parse(insights)
      res.json({ insights: parsedInsights })
    } catch (parseError) {
      // If JSON parsing fails, return as string
      res.json({ insights: insights })
    }
  } catch (error) {
    console.error("Generate insights error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get conversation history
router.get("/conversations", async (req, res) => {
  try {
    // Mock user ID for now - replace with actual auth middleware
    const userId = "mock-user-id"
    const { page = 1, limit = 20 } = req.query

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    res.json(conversations)
  } catch (error) {
    console.error("Get conversations error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export { router as aiRouter }
