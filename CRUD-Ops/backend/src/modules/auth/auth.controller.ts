import { FastifyRequest, FastifyReply } from "fastify";
import { loginService, registerService } from "./auth.service.js";
import { LoginDTO, RegisterDTO } from "./auth.types.js";

export const registerController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = req.body as RegisterDTO;
    const result = await registerService(req.server.knex, body);

    console.log("User registered : ", result);
    
    return reply.code(201).send({
      message: "User registered successfully.Login To continue",
      alert: "Redirection TO Login Page!!",
      ...result,
    });
  } catch (error: any) {
    if (error.message === "USER_EXISTS") {
      return reply.code(409).send({ message: "User already exists" });
    }
    return reply.code(500).send({ message: "REGISTER_FAILED" });
  }
};

export const loginController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = req.body as LoginDTO;
    const result = await loginService(req.server.knex, body);

    console.log("Login success:", result, result.token);
    return reply.code(200).send({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    return reply.code(401).send({ message: "INVALID_CREDENTIALS" });
  }
};
