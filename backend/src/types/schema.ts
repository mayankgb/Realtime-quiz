import { z } from "zod"

export const createSchema = z.object({
    id: z.string().min(1),
    username: z.string().min(1)
})


export const joinSchema = z.object({ 
    username: z.string().min(1),
    quizKey: z.number(),
    quizId: z.string().min(1)
})

export const quizKey = z.object({
    key: z.number() 
})

