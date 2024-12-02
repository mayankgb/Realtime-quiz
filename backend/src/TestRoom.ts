import { WebSocket } from "ws"
import { CustomWebsocket, Question } from "./types/types"
import { v4 as uuid } from "uuid"

interface User {
    id: string,
    name: string,
    points: number
    submission: {
        questionId: string,
        index: number,
        isCorrect: boolean
    }[]
}

interface Admin {
    id: string,
    username: string
}

interface isCorrect {
    submission: boolean,
    correctAns: number
}

type userId = string

export class TestRoom {

    user: User[]
    roomId: string
    userws: Map<userId, WebSocket | null>
    questions: Question[]
    sunmissionCount: number
    currentQuestion: Question | null
    currentState: "started" | "waiting" | "leaderBoard" | "ended"
    index: number
    startTime!: number
    admin: Admin
    adminWs: WebSocket | null
    quizId: string
    quizKey: number
    correctAnswer: string | null
    onEndQuiz: (roomId: string, roomKey: number, adminId: string) => void
    private adminTimer: NodeJS.Timeout | null
    private submissionCorrectness: Map<userId, isCorrect>

    constructor(questions: Question[], quizId: string, roomId: string, admin: Admin, callback: (roomId: string, roomKey: number, adminId: string) => void, quizKey: number) {
        this.user = []
        this.userws = new Map()
        this.questions = questions
        this.currentQuestion = null
        this.sunmissionCount = 0
        this.currentState = "waiting"
        this.index = 0
        this.adminWs = null
        this.onEndQuiz = callback
        this.admin = admin
        this.roomId = roomId
        this.quizId = quizId
        this.submissionCorrectness = new Map()
        this.adminTimer = null
        this.quizKey = quizKey
        this.correctAnswer = null
    }

    startQuiz() {

        this.next()

    }
    next() {

        if (this.currentState !== "waiting") {
            return
        }

        if (this.index > this.questions.length) {
            return
        }

        console.log(this.index)
        console.log(this.questions.length)

        this.currentQuestion = this.questions[this.index]!
        this.correctAnswer = this.currentQuestion.options.find((value) => value.index === this.currentQuestion!.correctIndex)!.text
        this.index += 1;
        this.currentState = "started"
        this.startTime = new Date().getTime()
        this.userws.forEach((ws) => {
            ws?.send(JSON.stringify({
                status: this.currentState,
                id: this.currentQuestion?.id,
                questions: this.currentQuestion?.text,
                options: this.currentQuestion?.options,
                points: 1000,
                startTime: this.startTime
            }))
        })
        this.adminWs?.send(JSON.stringify({
            status: this.currentState,
            id: this.currentQuestion?.id,
            questions: this.currentQuestion?.text,
            options: this.currentQuestion?.options,
            points: 1000,
            startTime: this.startTime
        }))
        setTimeout(() => {
            this.leaderBoard()
        }, 10 * 1000)

    }

    leaderBoard() {

        const result = this.calculateResult()
        this.currentState = "leaderBoard"

        this.user.map((x) => {
            if (this.userws.has(x.id)) {
                this.userws.get(x.id)?.send(JSON.stringify({
                    status: this.currentState,
                    result: result,
                    userPoints: x.points,
                    isCorrect: this.submissionCorrectness.has(x.id) ? this.submissionCorrectness.get(x.id)!.submission ? "you are correct": "you are inccorect": "you miss this one ",
                    // isCorrect: x.submission.find((value) => value.questionId === this.currentQuestion?.id && value.isCorrect)
                    correctAns: this.correctAnswer
                }))
            }
        })

        this.adminWs?.send(JSON.stringify({
            status: this.currentState,
            result: result

        }))

        console.log("leaderBoard", this.index)
        console.log("leaderBoard", this.questions.length)

        if (this.index >= this.questions.length) {
            this.currentState = "ended"

            setTimeout(() => {

                this.userws.forEach((ws) => {
                    ws?.send(JSON.stringify({
                        status: "ended"
                    }))
                })
                this.adminWs?.send(JSON.stringify({
                    status: "ended"
                }))
                this.endQuiz()
            }, 10 * 1000);
        } else {
            this.currentState = "waiting"
            setTimeout(() => {
                this.userws.forEach((ws) => {
                    ws?.send(JSON.stringify({
                        status: this.currentState,
                        totalPlayers: this.userws.size
                    }))
                })
                this.adminWs?.send(JSON.stringify({
                    status: this.currentState,
                    totalPlayers: this.userws.size,
                    roomKey: this.quizKey
                }))
                if (!this.adminWs) {
                    setTimeout(() => {
                        this.next()
                    },5 * 1000);
                }
            }, 8 * 1000)
        }

    }

    addNewUser(username: string) {

        const newUserId = uuid()
        const newUser: User = {
            id: newUserId,
            name: username,
            points: 0,
            submission: []
        }

        this.user.push(newUser)
        this.userws.set(newUserId, null)

        return newUser.id

    }

    private calculateResult() {

        return this.user.sort((a, b) => b.points - a.points).map((value) => {
            return {
                id: value.id,
                points: value.points,
                name: value.name
            }
        }).slice(0, 10);

    }


    checkSubmission(index: number, id: string, questionId: string) {

        const date = new Date().getTime()

        if (id === this.admin.id) {
            console.log("admin chutiya hai")
            return {
                status: 403,
                message: "admin can't submit the answer"
            }
        }

        if (!(this.currentState === "started")) {
            console.log("ye kaise ho sakta hai")
            return {
                status: 400,
                message: "Invalid request"
            }
        }

        if (this.userws.has(id) && this.currentQuestion?.id === questionId) {
            console.log("meri selection ho gayi hai")
            const user = this.user.find((user) => user.id === id)
            const existingSubmission = user?.submission.find((submission) => submission.questionId === questionId)
            if (existingSubmission) {
                return {
                    status: 400,
                    message: "you already submitted the answer"
                }
            }
            if (this.currentQuestion.correctIndex === index) {
                console.log("sach mai meri selection ho gayi hai")
                if (user) {
                    user.points += (1000 - 500 * ((date - this.startTime) / (1000 * 10)))
                    user.submission.push({
                        index: index,
                        isCorrect: true,
                        questionId: questionId
                    })

                    this.submissionCorrectness.set(id, { submission: true, correctAns: index })
                }
            } else {
                console.log("meri selection nahi hui")
                user?.submission.push({
                    index: index,
                    questionId: questionId,
                    isCorrect: false
                })

                this.submissionCorrectness.set(id, { submission: false, correctAns: index })

            }

            return {
                status: 200,
                message: "your submission is submitted"
            }

        } else {
            console.log("kuch toh gadbad hai daya")
            return {
                status: 400,
                message: "Invalid request"
            }
        }

    }

    private sendquestion(ws: WebSocket, userId: string) {
        switch (this.currentState) {
            case "started":
                const points = (1000 - 500 * ((new Date().getTime() - this.startTime) / (1000 * 10)))
                ws.send(JSON.stringify({
                    id: this.currentQuestion?.id,
                    questions: this.currentQuestion?.text,
                    options: this.currentQuestion?.options,
                    startTime: this.startTime,
                    status: "started",
                    points: points,
                }));
                break;

            case "waiting":
                this.userws.forEach((value) => {
                    value?.send(JSON.stringify({
                        status: this.currentState,
                        totalPlayers: this.userws.size
                    }))
                })
                this.adminWs?.send(JSON.stringify({
                    status: this.currentState,
                    totalPlayers: this.userws.size,
                    roomKey: this.quizKey
                }))
                break;

            case "ended":
                ws.send(JSON.stringify({
                    status: this.currentState
                }));
                break;
            case "leaderBoard":
                ws.send(JSON.stringify({
                    status: this.currentState,
                    result: this.calculateResult(),
                    userPoints: this.user.find((value) => value.id === userId)?.points,
                    isCorrect: this.submissionCorrectness.has(userId) ? this.submissionCorrectness.get(userId)!.submission ? "you are correct": "you are inccorect": "you miss this one ",
                    // isCorrect: x.submission.find((value) => value.questionId === this.currentQuestion?.id && value.isCorrect)
                    correctAns: this.correctAnswer
                }));
                break;
        }
    }

    join(userId: string, ws: WebSocket) {

        const a = this.userws.get(userId)

        if (a === null) {
            console.log(a)
            this.userws.set(userId, ws)
            this.sendquestion(ws, userId)
            console.log('added user')
            return {
                status: 200,
                message: 'information updated successfully'
            }
        } else {
            return {
                status: 404,
                message: "user not found"
            }
        }
    }

    existingUser(userId: string, ws: WebSocket) {
        this.user.map((value) => {
            if (value.id === userId) {
                this.sendquestion(ws, userId)
                return true
            }
        })
        return false
    }

    private endQuiz() {
        this.onEndQuiz(this.roomId, this.quizKey, this.admin.id)
    }

    adminJoin(ws: CustomWebsocket) {
        if (this.adminWs === null) {
            console.log("admin")
            this.adminWs = ws
            if (this.adminTimer) {
                clearTimeout(this.adminTimer)
                this.adminTimer = null    
            }
            
            this.sendquestion(ws, this.admin.id)
            return {
                status: 200,
                message: "updated successfully"
            }
        }
        return {
            status: 403,
            message: "Bad request"
        }
    }

    destroyUser(ws: WebSocket) {

        let existingUser: string = ""
        this.userws.forEach((value, index) => {
            if (value === ws) {
                existingUser = index
            } else {
                return ""
            }
        })

        if (!existingUser) {
            if (this.adminWs === ws) {
                this.adminWs = null
                console.log("admin deleted:", this.adminWs)
                if (this.currentState === "waiting") {
                    this.adminTimer =  setTimeout(() => {
                        this.next()
                       }, 5 * 1000)
                }
                return

            }
            return
        }
        this.userws.set(existingUser, null)
        console.log("user deleted:", this.userws.get(existingUser))

    }




}