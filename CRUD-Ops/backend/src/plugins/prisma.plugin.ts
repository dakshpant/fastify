import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export default fp(async (fastify) => {
  fastify.log.info("🔌 Initializing Prisma...");

  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    fastify.log.info("⏳ Connecting to MariaDB...");
    await prisma.$connect();
    fastify.log.info("✅ Prisma connected");
  } catch (err) {
    fastify.log.error(err);
    throw err;
  }

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
