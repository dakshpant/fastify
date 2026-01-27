import {
  type FastifyInstance,
  type FastifyPluginOptions,
  type FastifyRequest,
  type FastifyReply,
} from "fastify";
import {
  loginScema,
  registrationSchema,
  type loginSchemaType,
  type registerSchemaType,
} from "../validations/auth.validation.js";
import { comparePassword, hashPassword } from "../utils/helper.js";

const authRoutes = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) => {
  fastify.post(
    "/register",
    {
      schema: {
        body: registrationSchema,
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as registerSchemaType;

      const isUserExist = await fastify.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (isUserExist) {
        return reply.status(400).send("User Already Exist");
      }
      await fastify.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: await hashPassword(body.password),
        },
      });

      return reply.send("Registered User");
    }
  );
  fastify.post(
    "/login",
    {
      schema: {
        body: loginScema,
      },
    },
    async (request, reply) => {
      const body = request.body as loginSchemaType;

      const user = await fastify.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return reply.status(400).send("User Not Found");
      }
      const isPasswordValid = await comparePassword(
        body.password,
        user.password
      );
      if (!isPasswordValid) {
        return reply.status(400).send("Invalid Password");
      }

      const payLoad = {
        name: user.name,
        email: user.email,
        id: user.id,
      };
      const token = fastify.jwt.sign(payLoad, { expiresIn: "1h" });

      return reply.send({
        Messagr: "Login Successfull",
        user: {
          ...payLoad,
          token
        },
      });
    }
  );
};

export default authRoutes;
