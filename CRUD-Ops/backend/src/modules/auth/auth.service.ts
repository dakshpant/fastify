import { FastifyInstance } from "fastify";
import { comparePassword, hashPassword } from "../../helpers/bcrypt.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/jwt.helper.js";
import { LoginDTO, RegisterDTO } from "./auth.types.js";

export const registerService = async (
  fastify: FastifyInstance,
  data: RegisterDTO,
) => {
  // Check if user already exists
  const existingUser = await fastify.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) throw new Error("USER_EXISTS");

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await fastify.prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return user;
};

export const loginService = async (
  fastify: FastifyInstance,
  data: LoginDTO,
) => {
  const user = await fastify.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("INVALID_CREDENTIALS");

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) throw new Error("INVALID_CREDENTIALS");

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  return { accessToken, refreshToken };
};
