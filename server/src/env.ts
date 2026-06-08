import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(64),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.string().email(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3001),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
});

const defaults = {
  NODE_ENV: "development",
  PORT: 3001,
  CLIENT_URL: "http://localhost:5173",
} as const;

function createEnv() {
  if (process.env.SKIP_ENV_VALIDATION === "true") {
    return Object.assign(Object.create(null), process.env, defaults) as unknown as z.infer<typeof envSchema>;
  }
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

export const env = createEnv();
