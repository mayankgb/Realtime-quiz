// import { WebSocket } from "ws";
// // import {PrismaCli} from "pri"
// import { v4 as uuidv4} from "uuid"
// import { PrismaClient } from "@prisma/client";

// import { Question } from "./types/types";


// // const a = new PrismaClient

// export interface User {
//     id: string,
//     name: string,
//     wallet: string,
//     points: number,
//     submission: {
//         questionId: string,
//         index: number
//     }[]
// }

// export class Room {
//     roomId: string
//     roomKey: string
//     currentQuestion: Question | null = null
//     quizTime: number = 10
//     participants: User[]
//     totalQuestion: Question[] = []
//     currentState: "started" | "notStarted" | "ended" | "waiting" | "result"
//     index: number
//     startTime: number
//     User: Map<string, WebSocket>
//     timer: NodeJS.Timeout | null

//     constructor(roomId: string, roomKey: string) {
//         this.roomId = roomId;
//         this.roomKey = roomKey
//         this.totalQuestion = []
//         this.currentState = "notStarted"
//         this.index = 0;
//         this.currentQuestion = this.totalQuestion[this.index] || null;
//         this.startTime = new Date().getTime()
//         this.participants = []
//         this.User = new Map()
//         this.timer = null
//     }

//     async initialiseQuiz(userId: string): Promise<boolean> {

//         try {
//             const question = await prisma.$transaction(async (tx) => {
//                 const questions = await tx.quiz.findFirst({
//                     where: {
//                         id: this.roomId,
//                         status: "CREATED",
//                         userId: userId
//                     },
//                     select: {
//                         questions: {
//                             select: {
//                                 id: true,
//                                 text: true,
//                                 correctIndex: true,
//                                 imageUrl: true,
//                                 options: {
//                                     orderBy: {
//                                         index: "asc"
//                                     },
//                                     select: {
//                                         imageUrl: true,
//                                         text: true,
//                                         index: true
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 })

//                 await tx.quiz.update({
//                     where: {
//                         id: this.roomId
//                     },
//                     data: {
//                         status: "STARTED"
//                     }
//                 })
//                 return questions
//             })
//             if (!question) {
//                 return false
//             }
//             question.questions.map((value) => {
//                 const newQuestion: Question = {
//                     id: value.id,
//                     question: value.text,
//                     correctIndex: value.correctIndex,
//                     options: value.options.map((a) => {
//                         const newOptions = {
//                             imageUrl: a.imageUrl ?? "",
//                             text: a.text,
//                             index: a.index
//                         }
//                         return newOptions
//                     })
//                 }
//                 this.totalQuestion.push(newQuestion)
//                 this.currentState = "waiting"
//                 //send current state to admin
//             })

//             return true
//         } catch (e) {
//             return false

//         }
//     }

//     startQuiz() {
//         if (this.currentState === "notStarted") {
//             this.currentState = "started"
//             this.next()
//             return
//         }
//     }

//     private sendquestion(ws: WebSocket) {
//         switch (this.currentState) {
//             case "started":
//                 const points = (1000 - 500 * ((new Date().getTime() - this.startTime) / (1000 * 10)))
//                 ws.send(JSON.stringify({
//                     question: this.currentQuestion?.question,
//                     options: this.currentQuestion?.options,
//                     startTime: this.startTime,
//                     status: "started",
//                     points: points
//                 }));

//             case "waiting":
//                 ws.send(JSON.stringify({
//                     status: this.currentState
//                 }))

//             case "ended":
//                 ws.send(JSON.stringify({
//                     status: this.currentState
//                 }));
//             case "result":
//                 ws.send(JSON.stringify({
//                     status: this.currentState,
//                     leaderBoard: this.calculateResult()
//                 }));
//         }
//     }

//     addNewUser(user: User, ws: WebSocket) {
//         this.participants.push(user)
//         this.User.set(user.id, ws)
//         this.sendquestion(ws)
//     }

//     next() {
//         if (this.index > this.totalQuestion.length || (this.currentState === "ended")) {
//             return true
//         }
//         this.currentQuestion = this.totalQuestion[this.index] || null
//         this.index += 1;
//         this.sendQuiz()
//         this.timer = setTimeout(() => {
//             this.currentQuestion = null
//             this.publishResult()
//         }, this.quizTime + 1 * 1000)

//         return this.index > this.totalQuestion.length ? true : false
//     }

//     existingUser(userId:string, ws: WebSocket) {
//         this.participants.map((user) => {
//             if (user.id === userId) {
//                 this.sendquestion(ws)
//                 return true
//             }
//         } )
//         return false
//     }

//     checkSubmission(index: number, id: string, questionId: string) {

//         const date = new Date().getTime()

//         if (!(this.currentState === "started")) {
//             return
//         }
//         if (this.User.has(id) && this.currentQuestion?.id === questionId) {
//             if (this.currentQuestion.correctIndex === index) {
//                 const user = this.participants.find((user) => user.id === id)
//                 user && (user.points += (1000 - 500 * ((date - this.startTime) / (1000 * 10))))
//             }
//         }

//     }

//     private calculateResult() {

//         return this.participants.sort((a, b) => b.points - a.points).map((value) => {
//             return {
//                 id: value.id,
//                 points: value.points,
//                 name: value.name
//             }
//         }).slice(0, 10);

//     }

//     sendQuiz() {

//         this.User.forEach((ws) => {
//             ws.send(JSON.stringify({
//                 question: this.currentQuestion?.question,
//                 options: this.currentQuestion?.options
//             }))
//         })

//     }

//     publishResult() {
//         if (this.index > this.totalQuestion.length) {
//             this.currentState = "ended"
//             const leaderBoard = this.calculateResult()
//             this.dispenseBounty()
//             this.User.forEach((ws) => {
//                 ws.send(JSON.stringify({
//                     status: this.currentState,
//                     leaderBoard: leaderBoard
//                 }));
//             })
//             return this.endQuiz()
//         }
//         else {
//             const result = this.calculateResult()
//             this.User.forEach((ws, roomKey) => {
//                 ws.send(JSON.stringify({
//                     result: result

//                 }))
//             })
//             setTimeout(() => {
//                 this.currentState = "waiting"
//                 this.User.forEach((ws) => {
//                     ws.send(JSON.stringify({
//                         status: "waiting"
//                     }))
//                 })
//             }, 3 * 1000)
//             return false

//         }

//     }

//     private endQuiz() {

//         // RoomManager.getInstance().endQuiz(this.roomId, this.roomKey)

//         return true

//     }

//     private dispenseBounty() {

//         //three users to dispense the bounty with their amount and email id 

//         //kafka queue

//     }

//     generateRandomId(): string {

//         return uuidv4()


//     }

//     deleteUser(ws:WebSocket) {
//         let userId;
//         this.User.forEach((value,id) => {
//             if (value === ws) {
//                 userId = id;
//             }
//         })
//         if (userId) {
//             this.User.delete(userId)
//         }
//     }


// }