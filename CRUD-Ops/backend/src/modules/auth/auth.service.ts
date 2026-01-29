import { FastifyInstance } from "fastify";
import { comparePassword, hashPassword } from "../../helpers/bcrypt.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/jwt.helper.js";
import { RegisterInput, LoginInput } from "../auth/auth.schema.js";
import { AuthError } from "../../errors/auth-errors.js";
import { ValidationError } from "../../errors/validation-error.js";

export const registerService = async (
  fastify: FastifyInstance,
  data: RegisterInput,
) => {
  // Check if user already exists
  const existingUser = await fastify.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ValidationError(
      "USER_EXISTS",
      "User with this email already exists",
    );
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await fastify.prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "user"
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    },
  });

  return user;
};

export const loginService = async (
  fastify: FastifyInstance,
  data: LoginInput,
) => {
  const user = await fastify.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user)
    throw new AuthError("INVALID_CREDENTIALS", "Email or pass is incorrect");

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch)
    throw new AuthError(
      "INVALID_CREDENTIALS",
      "Email or password is incorrect",
    );

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

  return { accessToken, refreshToken };
};
