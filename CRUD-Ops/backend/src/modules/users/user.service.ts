import { FastifyInstance } from "fastify";
import { RegisterDTO } from "./user.types.js";
import { hashPassword } from "../../helpers/bcrypt.helper.js";
import { PrismaClient } from "@prisma/client/extension";

export const readUsersService = async (fastify: FastifyInstance, prisma: PrismaClient) => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

/**
 * iin the above function, we added prisma as a parameter to ensure that the extended PrismaClient is used.
 * This allows us to leverage any custom methods or extensions defined in our PrismaClient.
 
 *and below as prisma: PrismaClient is not used so use 
 */

export const getUsersService = async (
  fastify: FastifyInstance,
  userId: number,
) => {
  return fastify.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const deleteUsersService = async (
  fastify: FastifyInstance,
  userId: number,
) => {
  return fastify.prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const updateUserService = async (
  fastify: FastifyInstance,
  userId: number,
  data: Partial<RegisterDTO>,
) => {
  const updatedData: any = {};

  if (data.name) updatedData.name = data.name;
  if (data.email) updatedData.email = data.email;

  if (data.password) {
    updatedData.password = await hashPassword(data.password);
  }

  return fastify.prisma.user.update({
    where: { id: userId },
    data: updatedData,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};
