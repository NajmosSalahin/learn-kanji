import { Router, type Request, type Response } from "express";
import crypto from "crypto";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, updatePreferencesSchema } from "../lib/validations.js";
import { hashPassword, verifyPassword, generateToken, isPasswordBreached } from "../lib/auth.js";
import { signJWT } from "../lib/jwt.js";
import { connectDB } from "../lib/db.js";
import { User } from "../models/user.model.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email.js";
import { rateLimiters, checkRateLimit } from "../lib/rate-limit.js";
import { env } from "../env.js";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] as string || "unknown";
    const { email } = req.body;

    const ipResult = await checkRateLimit(rateLimiters.login, `ip:${ip}`);
    if (!ipResult.success) {
      res.status(429).json({ error: `Too many attempts. Try again in ${ipResult.retryAfter} seconds.`, retryAfter: ipResult.retryAfter });
      return;
    }

    if (email) {
      const emailResult = await checkRateLimit(rateLimiters.login, `email:${email}`);
      if (!emailResult.success) {
        res.status(429).json({ error: `Too many attempts. Try again in ${emailResult.retryAfter} seconds.`, retryAfter: emailResult.retryAfter });
        return;
      }
    }

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const { email: loginEmail, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email: loginEmail.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({ error: "Please verify your email before logging in.", code: "EMAIL_NOT_VERIFIED" });
      return;
    }

    const token = await signJWT(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800,
      path: "/",
    });

    res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt,
      },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  res.json({ message: "Logged out successfully." });
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] as string || "unknown";
    const { success, retryAfter } = await checkRateLimit(rateLimiters.register, ip);
    if (!success) {
      res.status(429).json({ error: `Too many attempts. Try again in ${retryAfter} seconds.`, retryAfter });
      return;
    }

    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const { email, password, displayName } = parsed.data;

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(201).json({ message: "Check your email to verify your account." });
      return;
    }

    const breached = await isPasswordBreached(password);
    if (breached) {
      res.status(400).json({ error: "This password has appeared in a known data breach. Please choose a different password." });
      return;
    }

    const passwordHash = await hashPassword(password);
    const { raw: rawToken, hashed: hashedToken } = generateToken();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      await sendVerificationEmail(email, displayName, rawToken);
    } catch (e) {
      console.error("Failed to send verification email:", e);
      res.status(500).json({ error: "Failed to send verification email. Please try again." });
      return;
    }

    await User.create({
      email,
      passwordHash,
      displayName,
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: expiry,
    });

    res.status(201).json({ message: "Check your email to verify your account." });
  } catch {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt,
      },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.patch("/me", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = updatePreferencesSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (parsed.data.displayName) user.displayName = parsed.data.displayName;
    if (parsed.data.timezone) user.timezone = parsed.data.timezone;

    if (parsed.data.dailyGoal !== undefined) user.preferences.dailyGoal = parsed.data.dailyGoal;
    if (parsed.data.newCardsPerDay !== undefined) user.preferences.newCardsPerDay = parsed.data.newCardsPerDay;
    if (parsed.data.studyMode) user.preferences.studyMode = parsed.data.studyMode;
    if (parsed.data.jlptTarget) user.preferences.jlptTarget = parsed.data.jlptTarget;

    user.markModified("preferences");
    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt,
      },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/change-password", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const { currentPassword, newPassword } = parsed.data;

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(400).json({ error: "Current password is incorrect." });
      return;
    }

    const breached = await isPasswordBreached(newPassword);
    if (breached) {
      res.status(400).json({ error: "This password has appeared in a known data breach. Please choose a different password." });
      return;
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: "Invalid or expired verification link." });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await connectDB();

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid or expired verification link." });
      return;
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    await user.save();

    const jwt = await signJWT(user._id.toString());

    res.cookie("token", jwt, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800,
      path: "/",
    });

    res.json({
      message: "Email verified!",
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        emailVerified: true,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt,
      },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] as string || "unknown";
    const { success, retryAfter } = await checkRateLimit(rateLimiters.resendVerification, ip);
    if (!success) {
      res.status(429).json({ error: `Too many attempts. Try again in ${retryAfter} seconds.`, retryAfter });
      return;
    }

    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (user && !user.emailVerified) {
      const { raw: rawToken, hashed: hashedToken } = generateToken();
      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();
      try {
        await sendVerificationEmail(email, user.displayName, rawToken);
      } catch {
      }
    }

    res.json({ message: "If that email exists, a verification link has been sent." });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] as string || "unknown";
    const { email } = req.body;

    const ipResult = await checkRateLimit(rateLimiters.forgotPassword, `ip:${ip}`);
    if (!ipResult.success) {
      res.status(429).json({ error: `Too many attempts. Try again in ${ipResult.retryAfter} seconds.`, retryAfter: ipResult.retryAfter });
      return;
    }

    if (email) {
      const emailResult = await checkRateLimit(rateLimiters.forgotPassword, `email:${email}`);
      if (!emailResult.success) {
        res.status(429).json({ error: `Too many attempts. Try again in ${emailResult.retryAfter} seconds.`, retryAfter: emailResult.retryAfter });
        return;
      }
    }

    if (!email) {
      res.status(200).json({ message: "If that email exists, a reset link has been sent." });
      return;
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (user) {
      const { raw: rawToken, hashed: hashedToken } = generateToken();
      user.passwordResetToken = hashedToken;
      user.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      try {
        await sendPasswordResetEmail(email, user.displayName, rawToken);
      } catch {
      }
    }

    res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] as string || "unknown";
    const { success, retryAfter } = await checkRateLimit(rateLimiters.resetPassword, ip);
    if (!success) {
      res.status(429).json({ error: `Too many attempts. Try again in ${retryAfter} seconds.`, retryAfter });
      return;
    }

    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const { token, password } = parsed.data;

    const breached = await isPasswordBreached(password);
    if (breached) {
      res.status(400).json({ error: "This password has appeared in a known data breach. Please choose a different password." });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await connectDB();
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid or expired reset link." });
      return;
    }

    user.passwordHash = await hashPassword(password);
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully. Please log in." });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
