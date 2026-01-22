import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { verifyToken } from "../helpers/jwt.helper.js";

// This is called module augmentation to add a new property to the FastifyRequest interface
//  It is used to add a new property to the FastifyRequest interface and make it available in the request object
//telling typescript that the FastifyRequest interface has a new property and every request will have this property
//i.e when used in a route handler, the FastifyRequest interface will have a new property called user
declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: number;
    };
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest("user", null);

  fastify.addHook("preHandler", async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.code(401).send({ message: "Missing token" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return reply.code(401).send({ message: "Invalid token format" });
    }

    try {
      const payload = verifyToken(token);
      request.user = { id: payload.id };
    } catch {
      return reply.code(401).send({ message: "Invalid or expired token" });
    }
  });
};

export default fp(authPlugin);
