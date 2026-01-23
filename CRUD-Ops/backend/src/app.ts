import fastify from "fastify";
import db from "./config/db.js";
import { ProtectedUserRoutes } from "./modules/users/user.routes.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import cors from "@fastify/cors";
import cookies from "@fastify/cookie";

const app = fastify({ logger: true });
await app.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});
await app.register(cookies);

app.register(db);

app.register(authRoutes, { prefix: "/api/auth" });
app.register(ProtectedUserRoutes, { prefix: "/api/user" });

export default app;
