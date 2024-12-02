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