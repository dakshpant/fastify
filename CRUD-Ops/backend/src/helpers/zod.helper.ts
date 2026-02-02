import { FastifyRequest } from "fastify";
import { ZodError, ZodSchema } from "zod";
import { ValidationError } from "../errors/validation-error.js";

type ZodSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export function zodValidate(schemas: ZodSchemas) {
  return async (request: FastifyRequest) => {
    try {
      if (schemas.body) {
        request.body = schemas.body.parse(request.body);
      }

      if (schemas.params) {
        request.params = schemas.params.parse(request.params);
      }

    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(error.errors[0].message);
      }
      throw error;
    }
  };
}
