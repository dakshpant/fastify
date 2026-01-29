import { FastifyRequest, FastifyReply } from "fastify";
import { loginService, registerService } from "./auth.service.js";
import {
  generateAccessToken,
  verifyRefreshToken,
} from "../../helpers/jwt.helper.js";
import { RegisterInput, LoginInput } from "./auth.schema.js";
import { AuthError } from "../../errors/auth-errors.js";

export const registerController = async (
  req: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply,
) => {
  const body = req.body;

  // 🔑 Prisma now comes from Fastify
  const result = await registerService(req.server, body);

  return reply.code(201).send({
    success: true,
    message: "User registered successfully. Login to continue",
    alert: "Redirection TO Login Page!!",
    data: result,
  });
  //   catch (error: any) {
  //   if (error.message === "USER_EXISTS") {
  //     return reply.code(409).send({ message: "User already exists" });
  //   }

  //   return reply
  //     .code(500)
  //     .send({ message: "REGISTER_FAILED", error: error.message });
  // }
};

export const loginController = async (
  req: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) => {
  // try {
  const body = req.body;

  const { accessToken, refreshToken } = await loginService(req.server, body);

  reply
    .setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    })
    .setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 1 * 24 * 60 * 60,
    });
  return {
    success: true,
    message: "Login successful",
  };
  // } catch (error) {
  //   return reply.code(401).send({ message: "INVALID_CREDENTIALS" });
  // }
};

export const refreshTokenController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  // try {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    throw new AuthError("NO_REFRESH_TOKEN", "Refresh token missing");

  const payload = verifyRefreshToken(refreshToken);
  const newAccessToken = generateAccessToken({ id: payload.id });

  reply.setCookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60,
  });

  return {
    success: true,
    message: "Access token refreshed",
    accessToken: newAccessToken,
  };
  // } catch {
  // return reply.code(401).send({ message: "INVALID_REFRESH_TOKEN" });
  // }
};

export const logOutController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.clearCookie("refreshToken", {
    path: "/",
  });

  return {
    success: true,
    message: "LOGOUT_SUCCESS",
  };
};
