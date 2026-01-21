import { FastifyInstance } from "fastify";
import {
  registerController,
  loginController,
} from "./auth.controller.js";
import {
  registerSchema,
  loginSchema,
} from "./auth.schema.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", { schema: registerSchema }, registerController);
  app.post("/login", { schema: loginSchema }, loginController);
}
