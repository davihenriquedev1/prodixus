import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  notes: z.string().optional(),
  completed: z.boolean().optional(),
  archived: z.boolean().optional(),
  estimatedDuration: z.number().int().optional(),
  dueAt: z.coerce.date().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  errorColor: z.string().optional(),
  folderId: z.uuid().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
