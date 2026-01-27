import app from  "./app.js"
// import authRoutes from "./routes/auth.routes.js";
import Env from "./utils/env.js";


// app.register(authRoutes)

const start = async () =>{
    await app.listen({port: Env.PORT});
    console.log(`Server Running on Port 4000`);    
}


start()