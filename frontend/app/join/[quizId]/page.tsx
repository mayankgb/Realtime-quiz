"use client"

import Ended from "@/app/_components/Ended"
import Result from "@/app/_components/leaderBoard"
import { Question } from "@/app/_components/Question"
import Submitted from "@/app/_components/Submitted"
import { Waiting } from "@/app/_components/Waiting"
import { currentQuestion, currentState, leaderBoard, totalPlayers, userPosition, ws } from "@/app/store/state"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { BACKEND_URL, Question as questionType } from "@/app/types/type"
import { AppBar } from "@/app/_components/AppBar"
import toast from "react-hot-toast"

export default function Quiz({ params }: { params: { quizId: string } }) {

    const [gameState, setGameState] = useRecoilState(currentState)
    const router = useRouter()
    const  setUserWs = useSetRecoilState(ws)
    const quizId = params.quizId
    const setTotalPlayers = useSetRecoilState(totalPlayers)
    const setLeaderBoard = useSetRecoilState(leaderBoard)
    const setQuestion = useSetRecoilState(currentQuestion)
    const setUserPosition = useSetRecoilState(userPosition)

    useEffect(() => {

        try {
            const data = JSON.parse(localStorage.getItem("user-quiz") || "") as { userId: string, quizId: string, quizKey: string } | null

            console.log(":asdasd")

            if (!data) {
                console.log("done")
                router.push("/")
                return
            }

            const socket = new WebSocket(`wss://${BACKEND_URL}`)

            setUserWs(socket)

            socket.onopen = () => {
                socket.send(JSON.stringify({
                    type: "join",
                    userId: data.userId,
                    roomId: data.quizId ?? quizId,
                    roomKey: parseInt(data.quizKey)

                }))
            }

            socket.onmessage = (message) => {

                const data = JSON.parse(message.data)

                if (data.status === "waiting") {
                    setGameState("waiting");
                    setTotalPlayers(data.totalPlayers);
                } else if (data.status === "leaderBoard") {
                    const leader = data.result as { id: string; name: string; points: number }[];
                    const userSubmission = {
                        userPoints: data.userPoints as number,
                        isCorrect: data.isCorrect as string,
                        correctAns: data.correctAns as string
                    };

                    setUserPosition(userSubmission);
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
                    return;
                }else {
                    router.push("/")
                }


            }

        } catch (e) {
            toast.error("quiz is not present",{
                style: {
                    background: "#333",
                    color: "#fff"
                }
            })
            router.push("/")
        }


    }, [])

    return (
        <div className="h-screen flex flex-col bg-opacity-50 bg-gradient-to-b to-neutral-800 from-neutral-800">
            <AppBar />
            {
                gameState === "waiting" ? <Waiting isAdmin={false} /> : gameState === "leaderBoard" ? <Result isAdmin={false} /> :
                    gameState === "started" ? <Question isAdmin={false} /> : gameState === "ended" ? <Ended /> : gameState === "Submitted" && <Submitted />
            }
        </div>
    )

}