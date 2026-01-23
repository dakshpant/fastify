import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET_KEY ;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY is not defined");
}

export interface AccessTokenPayload {
  id: number;
  // email: string;
}

export const generateToken = (payload: AccessTokenPayload) => {
  const Token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
    console.log("The toke is",Token);
  return Token
};

export const verifyToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
};

export const decodeToken = (token: string): AccessTokenPayload => {
  return jwt.decode(token) as AccessTokenPayload;
};