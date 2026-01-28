import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 chars"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password too short..."),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;



// export const registerSchema = z.object({
//   body: {
//     type: "object",
//     required: ["name", "email", "password"],
//     properties: {
//       name: { type: "string" },
//       email: { type: "string" },
//       password: { type: "string" },
//     },
//   },
// });

// export const loginSchema = z.object({
//   body: {
//     type: "object",
//     required: ["email", "password"],
//     properties: {
//       email: { type: "string" },
//       password: { type: "string" },
//     },
//   },
// });
