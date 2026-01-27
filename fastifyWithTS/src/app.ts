import fastify from "fastify";
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"   
import jwt from "@fastify/jwt"
import authRoutes from "./routes/auth.routes.js";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import dbPlugin from "./plugins/db.plugin.js";
import { jwtOption } from "./utils/jwtToken.js";

const app = fastify({
  logger: true,
});

/* Zod compilers MUST come before routes */
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors)
app.register(helmet)
app.register(dbPlugin)

app.register(jwt, jwtOption) 

app.register(authRoutes, {prefix: "/api/auth"})

app.get("/", (request, reply) => {
  return {
    message: `Welcome To auth Service!!`,
  };
});

// Global Error Handler 
app.setErrorHandler((error, request, reply) => {
  if ("validation" in error && Array.isArray((error as any).validation)) {
    const validationIssues = (error as any).validation;

    const formattedErrors = validationIssues.map(
      (issue: { instancePath: string; message: string }) => ({
        field: issue.instancePath.replace("/", ""),
        message: issue.message,
      })
    );

    return reply.status(400).send({
      success: false,
      errors: formattedErrors,
    });
  }

  /* fallback for other errors */
  reply.status(500).send({
    success: false,
    message: error.message,
  });
});



export default app;
