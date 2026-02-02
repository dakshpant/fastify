import { z } from "zod";

/* ---------------- ME (current user) ---------------- */

export const updateMeZodSchema = z
  .object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  });

export type UpdateMeInput = z.infer<typeof updateMeZodSchema>;

/* ---------------- ADMIN PARAMS ---------------- */

export const userIdParamsSchema = z.object({
  id: z.coerce
    .number({
      invalid_type_error: "User ID must be a number",
      required_error: "User ID is required",
    })
    .int("User ID must be an integer")
    .positive("User ID must be a positive number"),
});

export type UserIdParams = z.infer<typeof userIdParamsSchema>;
