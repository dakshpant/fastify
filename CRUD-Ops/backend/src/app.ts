import fastify from "fastify";
import cors from "@fastify/cors";
import cookies from "@fastify/cookie";
import { UserRoutes } from "./modules/users/user.routes.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import prismaPlugin from "./plugins/prisma.plugin.js";
import { errorHandlerPlugin } from "./plugins/errorHandler.plugin.js";
import googleAuthPlugin from "./plugins/googleAuth.plugin.js";

const app = fastify({ logger: true });

await app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});

await app.register(cookies);


// Prisma + errors
await app.register(prismaPlugin);
await app.register(errorHandlerPlugin);

// OAuth strategies
await app.register(googleAuthPlugin);

// Routes
await app.register(authRoutes, { prefix: "/api/auth" });
await app.register(UserRoutes, { prefix: "/api/user" });

export default app;
