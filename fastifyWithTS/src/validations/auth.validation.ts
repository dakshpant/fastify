import z, { email } from "zod"

export const registrationSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.email(),
    password: z.string().min(6).max(100)
})

export const loginScema = z.object({
    email: z.email(),
    password: z.string().min(6).max(100)
})

export type registerSchemaType = z.infer<typeof registrationSchema>
export type loginSchemaType = z.infer<typeof loginScema>