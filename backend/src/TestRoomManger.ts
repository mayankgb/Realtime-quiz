import { PrismaClient } from "@prisma/client"
import { TestRoom } from "./TestRoom"
import { CustomWebsocket, Question } from "./types/types"
import { v4 as uuid } from "uuid"

type adminId = string
type roomKey = number
type roomId = string
type quizId = string

export class TestRoomManager {

    private admin: Map<adminId, roomId>
    private roomKey: Map<roomKey, roomId>
    private rooms: Map<roomId, TestRoom>
    private quiz: Map<quizId, Question[]>
    private prisma: PrismaClient

    private static instance: TestRoomManager

    private constructor() {
        this.admin = new Map()
        this.roomKey = new Map()
        this.rooms = new Map()
        this.quiz = new Map()
        this.prisma = new PrismaClient()
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new TestRoomManager()
        }

        return this.instance
    }

    async createQuiz(username: string, quizId: string) {
        if (this.quiz.has(quizId)) {

            const newAdmin ={
                id: this.createRoomId(),
                username: username
            }
            const newRoomId = this.createRoomId()
            const newRoomKey = Math.floor(Math.random() * 1000000)
            const question = this.quiz.get(quizId)!
            const newRoom = new TestRoom(question, quizId, newRoomId, newAdmin, this.removeQuiz.bind(this), newRoomKey)

            this.roomKey.set(newRoomKey, newRoomId );
            this.rooms.set(newRoomId, newRoom);
            this.admin.set(newAdmin.id, newRoomId)

            return {
                status: 200,
                adminId: newAdmin.id,
                roomKey: newRoomKey,
                roomId: newRoomId
            }

        } else {
            const data = await this.prisma.quiz.findFirst({
                where: {
                    id: quizId
                },
                select: {
                    questions: {
                        select: {
                            id: true,
                            text: true,
                            correctIndex: true,
                            options: {
                                select: {
                                    imageUrl: true,
                                    text: true,
                                    index: true
                                }
                            }
                        }
                    }
                }
            })

            if (!data) {
                return {
                    status: 404,
                    message:"no quiz present with this id"
                }
            }

            this.quiz.set(quizId, data.questions)

            const id = this.createRoomId()
            const newAdmin = {
                id: this.createRoomId(),
                username: username
            }
            const key = Math.floor(Math.random() * 1000000)

            const createRoom = new TestRoom(data.questions, quizId, id, newAdmin, this.removeQuiz.bind(this), key)

            this.admin.set(newAdmin.id, id)
            if (this.roomKey.has(key)) {
                let newKey
                while (this.roomKey.has(key)) {
                    newKey = Math.floor(Math.random() * 1000000)
                }
                this.roomKey.set(newKey!, id)
            } else {
                this.roomKey.set(key, id)
            }
            this.rooms.set(id, createRoom)

            return {
                status: 200,
                adminId: newAdmin.id,
                roomKey: key,
                roomId: id,
            }
        }
    }

    private removeQuiz(roomId: string, roomKey: number, adminId: string) {

        this.admin.delete(adminId)
        this.rooms.delete(roomId)
        this.roomKey.delete(roomKey)
        console.log(this.rooms)
        console.log(this.admin)
        console.log(this.roomKey)

        console.log("deleted")

    }

    hasQuiz(roomKey: number){
        const roomId = this.roomKey.get(roomKey)

        if (roomId) {
            return{
                status: 200,
                roomId
            }
        }else {
            return {
                status: 404,
            }
        }

    }

    createUser(username: string, roomKey: number, roomId: string) {

        const existingRoomId = this.roomKey.get(roomKey)

        if (existingRoomId && existingRoomId === roomId) {
            const existingRoom = this.rooms.get(roomId)!

           const response =  existingRoom.addNewUser(username)

           return {
            status: 200,
            message: response
           }
        }else{
            return {
                status: 404,
                message: "room not found"
            }
        }


    }

    join(userId: string, roomId: string , roomKey: number, ws:CustomWebsocket) {

        if (!userId || !roomId || !roomKey) {
            return {
                status: 400,
                message: "incomplete details"
            }
        }

        const existingRoomId = this.roomKey.get(roomKey)

        if (existingRoomId && existingRoomId === roomId) {
            const existigRoom = this.rooms.get(roomId)!

            if (existigRoom.admin.id === userId) {
                console.log("isAdmin")
                ws.roomId = roomId
                const adminInfo = existigRoom.adminJoin(ws)
                return adminInfo
            }

            ws.roomId = roomId
            const newUser = existigRoom.join(userId, ws)

            return newUser
        }else {
            return {
                status: 404,
                message: "not found"
            }
        }

    }

    submission(userId: string , roomId: string, roomKey: number, questionId: string, index: number) {

        if (!userId || !roomId || !roomKey || !questionId || index === undefined || index === null) {
            return {
                status: 400,
                message: "Invalid request"
            }            
        }

        const existingRoomId = this.roomKey.get(roomKey)

        if (existingRoomId && existingRoomId === roomId) {
           const response =  this.rooms.get(roomId)!.checkSubmission(index, userId, questionId)
           return response
        }else {
            return {
                status: 400,
                message: "Invalid request"
            }
        }

    }

    next(adminId: string , roomKey: number, roomId: string) {

        if (!adminId || !roomKey || !roomId) {
            return {
                status: 400,
                message: "missing inputs"
            }
        }

        const existingRoomId = this.roomKey.get(roomKey)

        if (existingRoomId && existingRoomId === roomId) {
           this.rooms.get(roomId)!.admin.id === adminId && this.rooms.get(roomId)!.next()
        }else {
            return {
                status: 403,
                message: "Invalid inputs"
            }
        }

    }

    disconnect(ws: CustomWebsocket){

       const room =  this.rooms.get(ws.roomId)

        if (room) {
            room.destroyUser(ws)
        }
        return

    }

    private createRoomId() {

        return uuid()

    }


}