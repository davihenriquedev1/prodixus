import { AppError } from "@/errors/app.error.js";
import { UserRepository } from "@/repositories/user.repository.js";
import bcrypt from "bcrypt";
import type { Prisma } from "../../generated/prisma/client.js";
import { z } from "zod";
import type { registerSchema } from "@/validators/auth.validator.js";

export const AuthService = {
  async registerUser(data: z.infer<typeof registerSchema>) {
    const userDB = await UserRepository.findByEmail(data.email);

    if (userDB) {
      throw new AppError(
        409,
        "USER_ALREADY_EXISTS",
        "User with this email already exists",
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10); // (auto-gen a salt and hash):

    const userData: Prisma.UserCreateInput = {
      name: data.name,
      email: data.email,
      passwordHash,
    };

    const user = await UserRepository.create(userData);

    // generate access token

    // generate refresh token

    // save refresh token

    // return authentication result

    return user;
  },
};
