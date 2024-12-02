import { Router } from "express";
import { createSchema } from "../types/schema";
import { TestRoomManager } from "../TestRoomManger";

export const adminRouter = Router()

adminRouter.post("/create", async (req, res) => {

    const parsedData = createSchema.safeParse(req.body)

    if (!parsedData.success) {
        console.log(parsedData.error)
        res.status(403).json({
            message: "invalid inputs "
        })
        return
    }

    const response = await TestRoomManager.getInstance().createQuiz(parsedData.data.username, parsedData.data.id)

    if (response.status === 200) {

        res.json({
            adminId: response.adminId,
            roomKey: response.roomKey,
            roomId: response.roomId,
            username: parsedData.data.username
        })
        return
    }else {
        res.status(response.status).json({
            message: response.message
        })
        return
    }


})