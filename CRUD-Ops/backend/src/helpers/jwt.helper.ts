import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.JWT_SECRET_KEY;
const refreshToken = process.env.REFRESH_TOKEN_SECRET;

if (!accessToken) {
  throw new Error("JWT_SECRET_KEY is not defined");
}

export interface AccessTokenPayload {
  id: number;
  role: "USER" | "ADMIN";
  // email: string;
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
  const Token = jwt.sign(payload, accessToken, {
    expiresIn: "15m",
  });
  console.log("The toke is", Token);
  return Token;
};

export const generateRefreshToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, refreshToken, {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, accessToken) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, refreshToken) as unknown as AccessTokenPayload;
};

export const decodeToken = (token: string): AccessTokenPayload => {
  return jwt.decode(token) as AccessTokenPayload;
};
