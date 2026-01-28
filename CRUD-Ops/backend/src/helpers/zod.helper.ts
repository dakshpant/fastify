import { ZodSchema } from "zod/v3";
import { FastifyReply, FastifyRequest } from "fastify";

export function zodValidate(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = await schema.parseAsync(request.body);
    } catch (error) {
      reply.code(400).send({ error: "Validation failed", details: error });
    }
  };
}
