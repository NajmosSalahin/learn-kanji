import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../lib/jwt.js";

const PROTECTED_PATHS = [
  "/api/study",
  "/api/progress",
  "/api/auth/me",
  "/api/auth/change-password",
];

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const isProtected = PROTECTED_PATHS.some((p) => req.path.startsWith(p));

  const token = req.cookies?.token;
  let userId: string | null = null;

  if (token) {
    const payload = await verifyJWT(token);
    if (payload) userId = payload.userId;
  }

  if (isProtected && !userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (userId) {
    (req as any).userId = userId;
  }

  next();
}
