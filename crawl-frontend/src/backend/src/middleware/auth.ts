import { Request, Response, NextFunction } from "express"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // For now, just pass through - implement actual auth later
  next()
} 