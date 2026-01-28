import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

export async function errorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {

    //Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.errors.map(e => e.message).join(", "),
        },
      });
    }

    //Known application errors
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    //Unknown errors (bugs)
    app.log.error(error);

    return reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  });
}
