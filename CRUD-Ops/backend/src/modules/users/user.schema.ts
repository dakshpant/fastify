import { z } from "zod";

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

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  },
};

export const registerSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
    },
  },
};

//Ond Schemas for ":id routes"

export const readUserSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
    },
  },
};

export const getUserSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
};

export const deleteUserSchema = {
  response: {
    200: {
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "number" },
        },
      },
    },
  },
};

export const updateUserSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
};

///me authentication and authorization routes schema

export const getMeSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
  },
};

export const updateMeSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
    },
    additionalProperties: false,
  },
};

export const deleteMeSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
