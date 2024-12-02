import { Router } from "express";
import { joinSchema, quizKey } from "../types/schema";
import { TestRoomManager } from "../TestRoomManger";

export const userRouter = Router()

userRouter.post("/getquiz", async (req, res) => {
    console.log(req.body)
    const parsedBody = quizKey.safeParse(req.body)

    if (!parsedBody.success) {
        console.log(parsedBody.error)
        res.status(403).json({
            message: "invalid request"
        })
        return

    }

    const response = TestRoomManager.getInstance().hasQuiz(parsedBody.data.key)

    if (response.roomId) {
        res.json({
            quizId: response.roomId
        })
        return
    }else {
        res.status(404).json({
            message: "quiz not found"
        })
        return
    }

})

userRouter.post("/join", async (req, res) => {

    const parsedBody = joinSchema.safeParse(req.body)

    if (!parsedBody.success) {
        console.log(parsedBody.error)
        res.status(403).json({
            message:'invalid inputs'
        })
        return
    }

    const response = TestRoomManager.getInstance().createUser(parsedBody.data.username, parsedBody.data.quizKey, parsedBody.data.quizId)

    if (response.status === 200) {
        res.json({
            userId: response.message
        })
        return
    }
    else {
        res.status(response.status).json({
            message: response.message
        })
        return
    }

})


userRouter.get("/ping", async (req, res) => {
     res.json({
        message: "quizmaster is up"
    })
    return
})