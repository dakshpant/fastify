import { FastifyPluginAsync } from "fastify";
import {
  getMeController,
  deleteMeController,
  updateMeController,
} from "./user.controller.js";
import {
  getMeSchema,
  deleteMeSchema,
  updateMeSchema,
} from "./user.schema.js";
import authPlugin from "../../plugins/auth.plugin.js";

export const ProtectedUserRoutes: FastifyPluginAsync = async (app) => {
  // auth plugin will protect everything below
  app.register(authPlugin);
  // app.get("/readUser", { schema: readUserSchema }, readUsersController);
  // app.get("/me", { schema: getMeSchema }, getMeController);
  // app.delete(
  //   "/deleteMe",
  //   { schema: deleteMeSchema },
  //   deleteMeController,
  // );
  // app.put(
  //   "/updateMe",
  //   { schema: updateMeSchema },
  //   updateMeController,
  // );
};
