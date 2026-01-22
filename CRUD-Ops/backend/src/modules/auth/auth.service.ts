import { Knex } from "knex";
import { comparePassword, hashPassword } from "../../helpers/bcrypt.helper.js";
import { generateToken } from "../../helpers/jwt.helper.js";
import { LoginDTO, RegisterDTO } from "./auth.types.js";

export const registerService = async (db: Knex, data: RegisterDTO) => {
  const existingUser = await db("users").where({ email: data.email }).first();
  if (existingUser) throw new Error("USER_EXISTS");

  const hashedPassword = await hashPassword(data.password);

  const [id] = await db("users").insert({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return {
    id,
    name: data.name,
    email: data.email,
  }
};

export const loginService = async (db: Knex, data: LoginDTO) => {
  const user = await db("users").where({ email: data.email }).first();
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) throw new Error("INVALID_CREDENTIALS");

  const token = generateToken({ id: user.id });

  return { token };
};
