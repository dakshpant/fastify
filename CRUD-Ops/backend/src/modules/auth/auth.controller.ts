import { FastifyRequest, FastifyReply } from "fastify";
import {
  registerService,
  loginService,
  googleLoginService,
} from "./auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../helpers/jwt.helper.js";
import { RegisterInput, LoginInput } from "./auth.schema.js";
import { AuthError } from "../../errors/auth-errors.js";

/* ───────────────────────── REGISTER ───────────────────────── */

export const registerController = async (
  req: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply,
) => {
  const user = await registerService(req.server, req.body);

  return reply.code(201).send({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

/* ───────────────────────── LOGIN ───────────────────────── */

export const loginController = async (
  req: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) => {
  const { accessToken, refreshToken } = await loginService(
    req.server,
    req.body,
  );

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
      maxAge: 7 * 24 * 60 * 60,
    });

  return {
    success: true,
    message: "Login successful",
  };
};

/* ───────────────────────── REFRESH TOKEN ───────────────────────── */

export const refreshTokenController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AuthError("NO_REFRESH_TOKEN", "Refresh token missing");
  }

  const payload = verifyRefreshToken(refreshToken);

  const newAccessToken = generateAccessToken({
    id: payload.id,
    role: payload.role,
  });

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
  };
};

/* ───────────────────────── LOGOUT ───────────────────────── */

export const logOutController = async (
  _req: FastifyRequest,
  reply: FastifyReply,
) => {
  reply
    .clearCookie("accessToken", { path: "/" })
    .clearCookie("refreshToken", { path: "/" });

  return {
    success: true,
    message: "Logout successful",
  };
};

/* ───────────────────────── GOOGLE CALLBACK ───────────────────────── */

export const googleCallbackController = async (
  req: FastifyRequest<{ Querystring: { code?: string } }>,
  reply: FastifyReply,
) => {
  const { code } = req.query;

  if (!code) {
    throw new AuthError(
      "GOOGLE_CODE_MISSING",
      "Google authorization code missing",
    );
  }

  // 🔥 Exchange code → Google profile
  const googleUser = await req.server.googleOAuth.getUserFromCode(code);

  // 🔥 Find or create user
  const { accessToken, refreshToken } = await googleLoginService(
    req.server,
    googleUser,
  );

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
      maxAge: 7 * 24 * 60 * 60,
    });

  return reply.redirect(`${process.env.FRONTEND_URL}/me`);
};
