import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();


const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await app.listen({ port: PORT });
    console.log(`🚀 Server running on Port:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

await start();
