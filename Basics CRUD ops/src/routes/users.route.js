import fastify from "fastify";
import fastifyBcrypt from "fastify-bcrypt";
import { authHandler } from "../hooks/auth.hook.js";

const createUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "pass"], //if nothing added in req filled everything gets optional
    properties: {
      name: {
        type: "string",
      },
      email: {
        type: "string",
      },
      pass: {
        type: "string",
      },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
      },
    },
  },
};

async function userRouter(fastify, opts) {
  // Adding hooks like this will add the hooks authorzation to all the routes to make it specific to one can create a hooks folder and import and use it in desired route 
  //  fastify.addHook('preHandler',(req, reply, done)=>{
  //     console.log(`Checking `);
  //     done()
  //   })


  //Post API to save user data into the DB
  fastify.post(
    "/api/users",
    { schema: createUserSchema },
    async (request, reply) => {
      const { name, email, pass } = request.body;
      const userCollection = fastify.mongo.db.collection("users");

      const hashPassword = await request.bcryptHash(pass);

      const result = await userCollection.insertOne({
        name,
        email,
        pass: hashPassword,
      });
      console.log(result);

      const insertedId = result.insertedId;
      console.log(insertedId);

      fastify.log.info("User Created", insertedId);

      console.log(request.body);

      reply.code(201);
      return {
        id: insertedId,
        name: request.body.name,
      };
    }
  );
  //Get User API using query method
  fastify.get("/api/users", async (req, reply) => {
    // The q query helps to search custom users bu their name or id or email
    const { q } = req.query;
    const userCollection = fastify.mongo.db.collection("users");
    let query = {};
    if (q) {
      query = {
        name: { $regex: q, $options: "i" }, //i is use for case insensitivity
      };
    }

    console.log("query", q);
    const user = await userCollection.find(query).toArray(); // passing query into the find method helps in querying and finding with full or half typed name.

    fastify.log.info("User list returned");

    return user;
  });
  //passing dynamic parameter to search users => Params
  fastify.get("/api/users/:id", {preHandler: authHandler} ,async (req, reply) => {

    console.log("From User Handler");
    

    const id = new fastify.mongo.ObjectId(req.params.id);

    const userCollection = fastify.mongo.db.collection("users");

    const users = await userCollection.findOne({ _id: id });

    return users;
  });
}
export default userRouter;
//Note
/**
 * fastify uses AJV internally so when te type of pass id number and
 * i pass a number in string format i.e "1234" the fastify AJV kiks in and internally converts the number sting into Number format so not error is thorwn but when we pass a alphabetical or char string error will occur.
 *
 * AJV => Another JSON Schema Validator
 */
