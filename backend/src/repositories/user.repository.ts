import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const UserRepository = {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  },
  async create(userData: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  },
};
