import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { ForbiddenError } from "../errors/forbidden-error.js";

type Role = "USER" | "ADMIN";

export const authorize =
  (allowedRoles: Role[]): FastifyPluginAsync =>
  async (fastify) => {
    fastify.addHook("preHandler", async (request) => {
      const userRole = request.user?.role;
      if (!allowedRoles.includes(userRole as Role))
        throw new ForbiddenError(
          "FORBIDDEN",
          "You do not have permission to access this resource",
        );
    });
  };

export default fp(authorize);
