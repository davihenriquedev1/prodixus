import z from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.uuid().optional(),
});

export const updateFolderSchema = createFolderSchema.partial();
