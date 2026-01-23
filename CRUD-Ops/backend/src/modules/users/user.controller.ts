import { FastifyRequest, FastifyReply } from "fastify";
import {
  readUsersService,
  getUsersService,
  deleteUsersService,
  updateUserService,
} from "./user.service.js";
import { RegisterDTO } from "./user.types.js";
import { log } from "node:console";

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
    console.log("User Details:", users);
  } catch (error: any) {
    return reply.code(409).send({
      message: "USER_NOT_FOUND",
    });
    throw error;
  }
};

export const getMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user.id;
    const user = await getUsersService(req.server.knex, userId);
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

export const deleteMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user.id;
    const user = await deleteUsersService(req.server.knex, userId);
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

export const updateMeController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user?.id;
    const body = req.body as Partial<RegisterDTO>;

    if (!body || Object.keys(body).length === 0) {
      return reply.code(400).send({
        message: "NO_FIELDS_TO_UPDATE",
      });
    }

    const existingUser = await getUsersService(req.server.knex, userId);

    if (!existingUser) {
      return reply.code(404).send({
        message: "USER_NOT_FOUND",
      });
    }

    const updatedRows = await updateUserService(req.server.knex, userId, body);
    console.log("Updated ROws:", updatedRows);

    if (updatedRows === 0) {
      return reply.code(400).send({
        message: "NOTHING_UPDATED",
      });
    }

    const updatedUser = await getUsersService(req.server.knex, userId);

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
