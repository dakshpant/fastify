import { FastifyRequest, FastifyReply } from "fastify";
import {
  readUsersService,
  getUsersService,
  deleteUsersService,
  updateUserService,
} from "./user.service.js";
import { RegisterDTO } from "./user.types.js";

export const readUsersController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const users = await readUsersService(req.server);

    return reply.code(200).send({
      message: "Users fetched successfully",
      data: users,
    });
  } catch {
    return reply.code(409).send({
      message: "USER_NOT_FOUND",
    });
  }
};

export const getMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user.id;

    const user = await getUsersService(req.server, userId);

    if (!user) {
      return reply.code(404).send({
        message: "USER_NOT_FOUND",
      });
    }

    return reply.code(200).send({
      message: "User fetched successfully",
      data: user,
    });
  } catch {
    return reply.code(409).send({
      message: "FAILED_TO_FETCH_USER",
    });
  }
};

export const deleteMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user.id;

    const user = await deleteUsersService(req.server, userId);

    if (!user) {
      return reply.code(404).send({
        message: "USER_NOT_FOUND",
      });
    }

    return reply.code(200).send({
      message: "User deleted successfully",
      data: user,
    });
  } catch {
    return reply.code(409).send({
      message: "FAILED_TO_DELETE_USER",
    });
  }
};

export const updateMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user.id;
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return reply.code(400).send({
        message: "NO_FIELDS_TO_UPDATE",
      });
    }

    const existingUser = await getUsersService(req.server, userId);

    if (!existingUser) {
      return reply.code(404).send({
        message: "USER_NOT_FOUND",
      });
    }

    const updatedUser = await updateUserService(req.server, userId, body);

    return reply.code(200).send({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch {
    return reply.code(500).send({
      message: "FAILED_TO_UPDATE_USER",
    });
  }
};
