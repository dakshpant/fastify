import Fastify from "fastify";
import fastifyMongodb from "@fastify/mongodb";
import userRouter from "./src/routes/users.route.js"
import fastifyBcrypt from "fastify-bcrypt";


const fastify = new Fastify({
  logger: true,
  transport:{
    target: "pino-pretty"
  }
});

//Database
fastify.register(fastifyMongodb, {
  forceClose: true,
  url:process.env.DB_URL,
})


fastify.register(fastifyBcrypt, {
  saltWorkFactor: 10,
});

fastify.register(userRouter)

fastify.get("/", (request, reply) => {
  return {
    message: `Welcome To auth Service!!`,
  };
});

const start = async () => {
  const PORT = process.env.PORT || 4000;
  try {
    await fastify.listen({
      port: PORT,
    });
    console.log(`Server Listening on port ${PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
