import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const ProjectRepository = {
  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data });
  },
};
