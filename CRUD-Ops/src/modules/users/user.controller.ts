import { FastifyRequest, FastifyReply } from "fastify";
import {
  readUsersService,
  getUsersService,
  deleteUsersService,
  updateUserService
} from "./user.service.js";
import { RegisterDTO } from "./user.types.js";

// export const registerController = async (
//   req: FastifyRequest,
//   reply: FastifyReply,
// ) => {
//   try {
//     const body = req.body as RegisterDTO;
//     // console.log(body);
//     // console.log("chaking");
//     // console.log(`Initing user service`);

//     const existingCheck = await req.server.knex("users").where({
//       email: body.email,
//     });
//     if (existingCheck.length > 0) {
//       throw new Error("USER_ALREADY_EXISTS");
//     }

//     const user = await registerUserService(req.server.knex, body);
//     return reply.code(201).send({
//       message: "User registered successfully",
//       data: user,
//     });
//   } catch (error: any) {
//     if (error.message === "USER_ALREADY_EXISTS") {
//       return reply.code(409).send({
//         message: "Ussr already exists",
//       });
//       throw error;
//     }
//   }
// };

export const readUsersController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const users = await readUsersService(req.server.knex);
    return reply.code(200).send({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error: any) {
    return reply.code(409).send({
      message: "USER_NOT_FOUND",
    });
    throw error;
  }
};

export const getUserController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params as { id: number };
    const user = await getUsersService(req.server.knex, id);
    if (!user) {
      return reply.code(404).send({
        message: "USER_NOT_FOUND",
      });
    }
    return reply.code(200).send({
      message: "Users fetched successfully",
      data: user,
    });
  } catch (error: any) {
    return reply.code(409).send({
      message: "FAILED_TO_FETCH_USER",
    });
    throw error;
  }
};

export const deleteUserController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params as { id: number };
    const user = await deleteUsersService(req.server.knex, id);
    if (!user) {
      return reply.code(404).send({
        message: "USER_NOT_FOUND",
      });
    }
    return reply.code(200).send({
      message: "Users Deleted successfully",
      data: user,
    });
  } catch (error: any) {
    return reply.code(409).send({
      message: "FAILED_TO_DELETE_USER",
    });
    throw error;
  }
};

export const updateUserController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params as { id: number };
    const body = req.body as Partial<RegisterDTO>;

    const existingUser = await getUsersService(req.server.knex, id);
    if (!existingUser) {
      return reply.code(404).send({
        message: "USER_NOT_FOUND",
      });
    }

    await updateUserService(req.server.knex, id, body);

    const updatedUser = await getUsersService(req.server.knex, id);

    return reply.code(200).send({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return reply.code(500).send({
      message: "FAILED_TO_UPDATE_USER",
    });
  }
};

