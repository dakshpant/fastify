import { FastifyPluginAsync } from "fastify";
import {
  readAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
} from "./user.controller.js";
import authPlugin from "../../plugins/auth.plugin.js";
import { authorize } from "../../plugins/roleBasedAuth.plugin.js";

export const UserRoutes: FastifyPluginAsync = async (app) => {
  app.register(authPlugin);
  app.register(authorize(["ADMIN"]));

  app.get("/", readAllUsersController);
  app.get("/:id", getUserByIdController);
  app.put("/:id", updateUserByIdController);
  app.delete("/:id", deleteUserByIdController);
};
