import { FastifyInstance } from "fastify";
import {
  registerController,
  loginController,
  refreshTokenController,
  logOutController,
} from "./auth.controller.js";
import {
  getMeController,
  updateMeController,
  deleteMeController,
} from "../users/user.controller.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { updateMeZodSchema } from "../users/user.schema.js";
import { zodValidate } from "../../helpers/zod.helper.js";
import authPlugin from "../../plugins/auth.plugin.js";
import { authorize } from "../../plugins/roleBasedAuth.plugin.js";

export async function authRoutes(app: FastifyInstance) {
  //PUBLIC ROUTES (NO AUTH)
  app.post(
    "/register",
    { preHandler: zodValidate(registerSchema) },
    registerController,
  );

  app.post("/login", { preHandler: zodValidate(loginSchema) }, loginController);

  app.post("/refresh", refreshTokenController);
  app.post("/logout", logOutController);

  //PROTECTED SCOPE
  app.register(async (protectedApp) => {
    protectedApp.register(authPlugin); //plugin applied HERE
    protectedApp.register(authorize(["USER", "ADMIN"]));

    protectedApp.get("/me", getMeController);

    protectedApp.put(
      "/me",
      { preHandler: zodValidate(updateMeZodSchema) },
      updateMeController,
    );

    protectedApp.delete("/me", deleteMeController);
  });
}
