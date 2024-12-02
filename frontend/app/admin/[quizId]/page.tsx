"use client"

import { AppBar } from "@/app/_components/AppBar"
import Ended from "@/app/_components/Ended"
import { Result } from "@/app/_components/leaderBoard"
import { Question } from "@/app/_components/Question"
import { Waiting } from "@/app/_components/Waiting"
import { currentQuestion, currentState, leaderBoard, roomKey, totalPlayers, ws } from "@/app/store/state"
import { BACKEND_URL, Question as questionType } from "@/app/types/type"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useRecoilState, useSetRecoilState } from "recoil"

export default function adminQuiz({ params }: { params: { quizId: string } }) {

    const router = useRouter()
    const quizId = params.quizId
    const [gameState, setGameState] = useRecoilState(currentState)
    const setTotalPlayers = useSetRecoilState(totalPlayers)
    const setLeaderBoard = useSetRecoilState(leaderBoard)
    const setQuestion = useSetRecoilState(currentQuestion)
    const [adminWs, setAdminWs] = useRecoilState(ws)
    const setRoomKey = useSetRecoilState(roomKey)
    useEffect(() => {

        try {
            const data = JSON.parse(localStorage.getItem("admin-quiz") || "") as { adminId: string, quizId: string, quizKey: string } || null

            const socket = new WebSocket(`wss://${BACKEND_URL}`)

            setAdminWs(socket)

            socket.onopen = () => {
                socket.send(JSON.stringify({
                    type: "join",
                    userId: data.adminId,
                    roomId: data.quizId ?? quizId,
                    roomKey: data.quizKey
                }))
            }

            socket.onmessage = (message) => {

                const data = JSON.parse(message.data)

                if (data.status === "waiting") {
                    setGameState("waiting");
                    setTotalPlayers(data.totalPlayers);
                    setRoomKey(data.roomKey)

                } else if (data.status === "leaderBoard") {

                    const leader = data.result as { id: string; name: string; points: number }[];
                    setLeaderBoard(leader);
                    setGameState("leaderBoard");

                } else if (data.status === "started") {

                    const newQuestion: questionType = {
                        id: data.id,
                        question: data.questions,
                        options: data.options,
                        startTime: data.startTime,
                        points: data.points,
                    };

                    setQuestion(newQuestion);
                    setGameState("started");

                } else if (data.status === "ended") {
                    setGameState("ended");
                } else if (data.status === "Submitted") {
                    setGameState("Submitted");
                } else if (data.status === "Unauthorised") {
                    toast.error(data.message, {
                     style: {
                        background: "#333",
                        color: "#fff"
                     }
                    })
                    localStorage.clear()
                    router.push("/");
                }


            }

        } catch (e) {
            toast.error("quiz is not present",{
                style: {
                    background: "#333",
                    color: "#fff"
                }
            })
            console.log("asdas")
            router.push("/")
        }


    }, [])

    return (
        <div className="h-screen flex flex-col bg-opacity-50 bg-gradient-to-b to-neutral-800 from-neutral-800">
            <AppBar />
            {
                gameState === "waiting" ? <Waiting isAdmin={true} /> : gameState === "leaderBoard" ? <Result isAdmin={true} /> :
                    gameState === "started" ? <Question isAdmin={true} /> : gameState === "ended" && <Ended />
            }
        </div>
    )


}