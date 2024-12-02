import { atom } from "recoil"
import { Question } from "../types/type"
import { sampleLeaderBoardData } from "../sample"
// import { sampleLeaderBoardData } from "../sample"

export const totalPlayers = atom({
    key: "totalPlayers",
    default: 0
})

export const currentQuestion = atom<Question | null>({
    key: "currentQuestion",
    default: null
})

export const currentState = atom<"waiting" | "started" | "leaderBoard" | "ended" | "Submitted" | null>({
    key: "currentState",
    default: "waiting"
})

export const ws = atom<WebSocket | null>({
    key: "ws",
    default: null
})

export const roomKey = atom<number | null>({
    key: "roomKey",
    default: null
})

interface userSubmission {
    userPoints: number,
    isCorrect: string
    correctAns: string | null
}


export const userPosition = atom<userSubmission | null>({
   key: "userPosition",
   default: {
    userPoints: 0,
    isCorrect: "you are incorrect",
    correctAns: null
   }
})

export interface LeaderBoard {
    id: string,
    name: string
    points: number
}

export const leaderBoard = atom<LeaderBoard[] | null>({
    key: "leaderBoard",
    default: sampleLeaderBoardData
})


