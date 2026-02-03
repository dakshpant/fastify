import { FastifyInstance } from "fastify";
import { comparePassword, hashPassword } from "../../helpers/bcrypt.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/jwt.helper.js";
import { RegisterInput, LoginInput } from "./auth.schema.js";
import { AuthError } from "../../errors/auth-errors.js";
import { ValidationError } from "../../errors/validation-error.js";

/* ───────────────────────── REGISTER ───────────────────────── */

export const registerService = async (
  fastify: FastifyInstance,
  data: RegisterInput,
) => {
  const existingUser = await fastify.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ValidationError(
      "USER_EXISTS",
      "User with this email already exists",
    );
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await fastify.prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "USER",           // ✅ FIXED
      provider: "LOCAL",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

/* ───────────────────────── LOGIN ───────────────────────── */

export const loginService = async (
  fastify: FastifyInstance,
  data: LoginInput,
) => {
  const user = await fastify.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.password) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid email or password");
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid email or password");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
  });

  return { accessToken, refreshToken };
};

/* ───────────────────────── GOOGLE LOGIN ───────────────────────── */

export const googleLoginService = async (
  fastify: FastifyInstance,
  data: {
    googleId: string;
    email: string;
    name: string;
  },
) => {
  let user = await fastify.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    user = await fastify.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: "USER",          // ✅ FIXED
        provider: "GOOGLE",
        providerId: data.googleId,
      },
    });
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
  });

  return { accessToken, refreshToken };
};
