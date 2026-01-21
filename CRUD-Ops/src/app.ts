import fastify from "fastify";
import db from "./config/db.js";
import { userRoutes } from "./modules/users/user.routes.js";
import { authRoutes } from "./modules/auth/auth.route.js";

const app = fastify({ logger: true });

app.register(db);

app.register(userRoutes, { prefix: "/api/user" });
app.register(authRoutes, { prefix: "/api/auth" });

export default app;
