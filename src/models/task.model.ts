import { z } from "zod";

export const statusEnum = ["pending", "in progress", "completed"] as const;

export const TaskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(statusEnum),
});

export type Task = z.infer<typeof TaskSchema>;
