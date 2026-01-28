import { FastifyRequest, FastifyReply } from "fastify";
import { loginService, registerService } from "./auth.service.js";
import { LoginDTO, RegisterDTO } from "./auth.types.js";
import {
  generateAccessToken,
  verifyRefreshToken,
} from "../../helpers/jwt.helper.js";

export const registerController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = req.body as RegisterDTO;

    // 🔑 Prisma now comes from Fastify
    const result = await registerService(req.server, body);

    return reply.code(201).send({
      message: "User registered successfully. Login to continue",
      alert: "Redirection TO Login Page!!",
      ...result,
    });
  } catch (error: any) {
    if (error.message === "USER_EXISTS") {
      return reply.code(409).send({ message: "User already exists" });
    }

    return reply
      .code(500)
      .send({ message: "REGISTER_FAILED", error: error.message });
  }
};

export const loginController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = req.body as LoginDTO;

    const { accessToken, refreshToken } = await loginService(req.server, body);

    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 1 * 24 * 60 * 60,
    });

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
    return reply.code(200).send({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    return reply.code(401).send({ message: "INVALID_CREDENTIALS" });
  }
};

export const refreshTokenController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return reply.code(401).send({ message: "No_Refresh_Token" });

    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({ id: payload.id });

    reply.setCookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });

    return reply.code(200).send({
      message: "Access token refreshed",
      accessToken: newAccessToken
    });
  } catch {
    return reply.code(401).send({ message: "INVALID_REFRESH_TOKEN" });
  }
};

export const logOutController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.clearCookie("refreshToken", {
    path: "/",
  });

  return reply.code(200).send({ message: "LOGOUT_SUCCESS" });
};
