import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  notes: z.string().optional(),
  priority: z.number().int().optional(),
  estimatedDuration: z.number().int().optional(),
  startAt: z.coerce.date().optional(),
  dueAt: z.coerce.date().optional(),
  completed: z.boolean().optional(),
  archived: z.boolean().optional(),
  projectId: z.uuid(),
  parentId: z.uuid().optional(),
});
