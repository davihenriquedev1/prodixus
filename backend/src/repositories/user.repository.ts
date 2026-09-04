import { prisma } from "@/config/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const UserRepository = {
  async findByEmail(email: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    return existingUser;
  },
  async findById(id: string) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    return existingUser;
  },
  async create(userData: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  },
  async update(userId: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
    return user;
  },
  async changePassword(userId: string, passwordHash: string) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });
    return user;
  },
};
