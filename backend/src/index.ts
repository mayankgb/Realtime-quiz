import express from "express"
import cors from "cors"
import { WebSocketServer} from "ws"
import { CustomWebsocket } from "./types/types"
import { TestRoomManager } from "./TestRoomManger"
import { adminRouter } from "./routes/admin"
import { userRouter } from "./routes/User"

const app = express()
const port = 8000

app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.use("/admin", adminRouter)
app.use("/user", userRouter)

const server = app.listen(port, () => console.log("connected on port 8000"))

const wss = new WebSocketServer({server:server})

wss.on("connection", function connection(ws: CustomWebsocket) {
    ws.on("error", console.error)

    ws.on("message", async function (message: any) {
        try{
            const data = JSON.parse(message)

            console.log(data)

            switch (data.type) {
                case "join":
                    const response = TestRoomManager.getInstance().join(data.userId, data.roomId, data.roomKey, ws)
                    console.log(response)
                    if (response.status >= 400) {
                        ws.send(JSON.stringify({
                            status:"Unauthorised",
                            message: response.message
                        }))
                        break;
                    }
                    break;
                case "next":
                    const newResponse = TestRoomManager.getInstance().next(data.adminId, data.roomKey, data.roomId)
                    if (newResponse && newResponse.status >= 400) {
                        ws.send(JSON.stringify({
                            status:"Unauthorised",
                            message: newResponse.message
                        }))
                        break;
                    }
                    break;
                case "Submission":

                console.log("chal rha hai shayad")
                    TestRoomManager.getInstance().submission(data.userId, data.roomId, data.roomKey, data.questionId, data.index)
                    break;
            }

        }catch(e){
            console.log(e)
            ws.send(JSON.stringify({
                status: "Unauthorised",
                message: "something went wrong"
            }))
            return
        }

    })

    ws.on("close", () => {
        TestRoomManager.getInstance().disconnect(ws)
    })

})
