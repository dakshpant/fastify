import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { verifyAccessToken } from "../helpers/jwt.helper.js";
import { AuthError } from "../errors/auth-errors.js";

// This is called module augmentation to add a new property to the FastifyRequest interface
//  It is used to add a new property to the FastifyRequest interface and make it available in the request object
//telling typescript that the FastifyRequest interface has a new property and every request will have this property
//i.e when used in a route handler, the FastifyRequest interface will have a new property called user
declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: number;
      role: "USER" | "ADMIN";
    };
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest("user", null);

  fastify.addHook("preHandler", async (request, reply) => {
    const token = request.cookies.accessToken;

    if (!token)
      throw new AuthError("NO_ACCESS_TOKEN", "Access token is missing");
    try {
      const payload = verifyAccessToken(token);
      request.user = { id: payload.id, role: payload.role };
    } catch {
      throw new AuthError(
        "INVALID_ACCESS_TOKEN",
        "Invalid or expired access token",
      );
    }
  });
};

export default fp(authPlugin);
