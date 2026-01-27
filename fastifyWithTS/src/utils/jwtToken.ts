import type { FastifyJWTOptions } from "@fastify/jwt";

export const jwtOption: FastifyJWTOptions = {
    secret: process.env.JWT_SECRET,
    sign: {
        expiresIn: "1h",
        algorithm: "HS256",
    }
}

