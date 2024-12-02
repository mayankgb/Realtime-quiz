export interface Question {
    id: string, 
    question: string ,
    imgUrl?: string,
    startTime: number,
    points: number,
    options:{ 
        text: string , 
        imgUrl?: string
        index:number
    }[]
}

export const BACKEND_URL = "quizmaster-a94j.onrender.com"