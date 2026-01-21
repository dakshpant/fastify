import { FastifyInstance } from "fastify";
import {  readUsersController, getUserController, deleteUserController, updateUserController } from "./user.controller.js";
import { registerSchema, readUserSchema, getUserSchema, deleteUserSchema, updateUserSchema } from "./user.schema.js";

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/readUser",
    {
      schema: readUserSchema,
    },
    readUsersController,
  );

  app.get(
    "/getUser/:id",
    {
      schema: getUserSchema,
    },
    getUserController
   );

   app.delete(
    "/deleteUser/:id",
    {
      schema: deleteUserSchema,
    },
    deleteUserController
   );

   app.put(
    "/updateUser/:id",
    {
      schema: updateUserSchema,
    },
    updateUserController
   );
}