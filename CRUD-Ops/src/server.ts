import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();


async function start() {
  try {
    await app.listen({ port: 3000 });
    console.log("🚀 Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

await start();
