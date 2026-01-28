import { FastifyRequest, FastifyReply } from "fastify";
import {
  readUsersService,
  getUsersService,
  deleteUsersService,
  updateUserService,
} from "./user.service.js";
import { NotFoundError } from "../../errors/not-found-error.js";
import { success } from "zod";
import { ValidationError } from "../../errors/validation-error.js";
// import { RegisterDTO } from "./user.types.js";

export const readUsersController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  // try {
  const users = await readUsersService(req.server);

  return {
    success: true,
    message: "Users fetched successfully",
    data: users,
  };
  // } catch {
  // return reply.code(409).send({
  // message: "USER_NOT_FOUND",
  // });
  // }
};

export const getMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  // try {
  const userId = req.user.id;

  const user = await getUsersService(req.server, userId);

  if (!user) throw new NotFoundError("USER_NOT_FOUND", "User Not Found");

  return {
    success: true,
    message: "User fetched successfully",
    data: user,
  };
  // } catch {
  //   return reply.code(409).send({
  //     message: "FAILED_TO_FETCH_USER",
  //   });
  // }
};

export const deleteMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  // try {
  const userId = req.user.id;

  const user = await deleteUsersService(req.server, userId);

  if (!user) {
    throw new NotFoundError("USER_NOT_FOUND", "User Not Found");
  }

  return {
    success: true,
    message: "User deleted successfully",
    data: user,
  };
  // } catch {
  //   return reply.code(409).send({
  //     message: "FAILED_TO_DELETE_USER",
  //   });
  // }
};

export const updateMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  // try {
  const userId = req.user.id;
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    throw new ValidationError(
      "NO_FIELDS_TO_UPDATE",
      "No fields provided for update",
    );
  }

  const existingUser = await getUsersService(req.server, userId);

  if (!existingUser)
    throw new NotFoundError("USER_NOT_FOUND", "User Not Found");

  const updatedUser = await updateUserService(req.server, userId, body);

  return {
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  };
  // } catch {
  //   return reply.code(500).send({
  //     message: "FAILED_TO_UPDATE_USER",
  //   });
  // }
};
