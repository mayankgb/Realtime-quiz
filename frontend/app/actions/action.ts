"use server"

import prisma from "@/client"

interface Quiz {
    id: string
    name: string
    imageUrl: string
  }
  

export async function getQuizes():Promise<Quiz[]>{
    const response = await prisma.quiz.findMany({
        where: {
          category: "NORMAL",
        },
        select:{
          id:true,
          imageUrl: true,
          name: true
        }
      })

      return response
}