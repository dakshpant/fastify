import { RegisterDTO } from "./user.types.js";
import { Knex } from "knex";
import { hashPassword } from "../../helpers/bcrypt.helper.js";

// export const registerUserService = async (db: Knex, data: RegisterDTO) => {
//   try {
//     // Log incoming request data
//     console.log("Register User Service called");
//     console.log("Incoming data:", data);

//     // Destructure required fields from DTO
//     const { name, email, password } = data;

//     console.log("Email & Password received:", email, password);

//     const hashedPassword = await hashPassword(password);

//     // console.log("Thsi is hadhed pass", hashedPassword);

//     // Insert user into the database
//     const insertUser = await db("users").insert({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // Knex usually returns inserted row IDs
//     console.log("User inserted successfully:", insertUser);

//     // Return safe response (never return password)
//     return {
//       name,
//       email,
//     };
//   } catch (error) {
//     // Log full error for debugging
//     console.error("Error while registering user:", error);

//     // Throw a clean error for controller / route layer
//     throw new Error("Failed to register user");
//   }
// };

export const readUsersService = async (db: Knex) => {
  const getUsers = await db("users").select("id", "name", "email");
  return getUsers;
};

export const getUsersService = async (db: Knex, userId: number) => {
  const getUsers = await db("users").where({ id: userId }).first();
  return getUsers;
};

export const deleteUsersService = async (db: Knex, userId: number) => {
  const deleteUsers = await db("users").where({ id: userId }).delete();
  return deleteUsers;
};

export const updateUserService = async (
  db: Knex,
  userId: number,
  data: Partial<RegisterDTO>,
) => {
  const updatedData: any = {};

  if (data.name) updatedData.name = data.name;
  if (data.email) updatedData.email = data.email;

  if (data.password) {
    updatedData.password = await hashPassword(data.password);
  }

  const updatedRows = await db("users").where({ id: userId }).update(updatedData);

  return updatedRows; 
};
