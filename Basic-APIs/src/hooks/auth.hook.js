/**
 *1>so this validateToken fcn is just an face to learn the logic.
 How is It working tHen ?
  =>we are using resolve reject 
so resolve always passes teh correct 
and reject always sens error 
2> What in real life scenarios?
in real instance what we will do is that inside the validateToken fcn  will write teh jwt token validation logic 
bearer token wala and it wil be the token validation logic
 */
const ValidateToken = () => {
  return new Promise((resolve, reject) => {
    //token check logic...
    resolve()
    // reject(new Error("User Token Is invelid"));
  });
};

export const authHandler = (req, reply, done) => {
  console.log(`Chaking Auth...`);
  ValidateToken()
    .then(() => {
      done();
    })
    .catch((err) => {
        reply.code(410).send({
            success: false
        })
        // done(err);
    });
};


