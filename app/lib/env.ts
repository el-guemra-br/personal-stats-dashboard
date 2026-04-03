import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DASHBOARD_NAME: z.string().min(1).default("Your Name"),
  DASHBOARD_BIO: z.string().default("Building useful things on the web."),
  DASHBOARD_LOCATION: z.string().default("Remote"),
  GITHUB_USERNAME: z.string().min(1).optional(),
  GITHUB_TOKEN: z.string().optional(),
  WAKATIME_API_KEY: z.string().optional(),
  TWITTER_USERNAME: z.string().optional(),
  TWITTER_BEARER_TOKEN: z.string().optional(),
  LINKEDIN_FOLLOWERS: z.coerce.number().int().nonnegative().optional(),
  CACHE_CLEAR_TOKEN: z.string().optional(),
  PORTFOLIO_URL: z.string().url().optional(),
  LINKEDIN_URL: z.string().url().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
