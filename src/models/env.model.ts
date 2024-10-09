import { z } from "zod";

export const EnvSchema = z.object({
  PORT: z.string(),
  DB_CONNECTION: z.string(),
  DB_NAME: z.string(),
  CLIENT_URL: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
