import { FastifyPluginAsync } from "fastify";
import {
  readAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
} from "./user.controller.js";
import authPlugin from "../../plugins/auth.plugin.js";
import { authorize } from "../../plugins/roleBasedAuth.plugin.js";
import { zodValidate } from "../../helpers/zod.helper.js";
import { UserIdParams, userIdParamsSchema } from "./user.schema.js";

export const UserRoutes: FastifyPluginAsync = async (app) => {
  app.register(authPlugin);
  app.register(authorize(["ADMIN"]));

  app.get("/", readAllUsersController);
  app.get(
    "/:id",
    {
      preHandler: zodValidate({
        params: userIdParamsSchema,
      }),
    },
    getUserByIdController,
  );
  app.put(
    "/:id",
    {
      preHandler: zodValidate({
        params: userIdParamsSchema,
      }),
    },
    updateUserByIdController,
  );
  app.delete(
    "/:id",
    {
      preHandler: zodValidate({
        params: userIdParamsSchema,
      }),
    },
    deleteUserByIdController,
  );
};
