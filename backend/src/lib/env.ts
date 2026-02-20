import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  PORT: z.coerce.number().int().positive().optional().default(3001),

  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),

  JWT_SECRET: z.string().min(32),

  ADMIN_EMAIL: z.string().email(),
  BREVO_API_KEY: z.string().min(10),
  BREVO_SENDER_EMAIL: z.string().email().optional(),

  FRONTEND_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
});

export type BackendEnv = z.infer<typeof envSchema>;

export function getEnv(): BackendEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid backend environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid backend environment variables');
  }
  return parsed.data;
}
