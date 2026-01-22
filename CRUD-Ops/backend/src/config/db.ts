import fp from "fastify-plugin";
import knex from "knex";

export default fp(async (fastify) => {
  const db = knex({
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,      
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME, 
      port: 3306,
    },
  });
  fastify.decorate("knex", db);
});
