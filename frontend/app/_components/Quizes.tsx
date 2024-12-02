"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, AtSign } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getQuizes } from "../actions/action"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { BACKEND_URL } from "../types/type"


interface Quiz {
    id: string
    name: string
    imageUrl: string
}

export default function Quizes() {
    const [quizes, setQuizes] = useState<Quiz[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [state, setState] = useState<0 | 1>(0)
    const [createQuiz, setCreateQuiz] = useState({
        id: "",
        username: ""
    })
    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter()

    async function fetchQuizes() {
        try {
            setIsLoading(true)
            setError(null)

            const result = await getQuizes()

            setQuizes(result)
        } catch (err) {
            console.error(err)
            setError("Failed to load quizzes. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchQuizes()
        }
    }, [isOpen])

    function handleClick(id: string) {
        setCreateQuiz((value) => ({
            ...value,
            id: id
        }))
        setState(1)
    }

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCreateQuiz((value) => ({
            ...value,
            username: e.target.value
        }))
    }

    async function handleSubmit() {
        setIsLoading(true)
        try{
            if (createQuiz.username.length <= 0 ) {
                toast.error("invalid username", {
                    style: {
                        border: "10px",
                        background: "#333",
                        color:"#fff"
                    }
                })
                setIsLoading(false)
                return
            }
            const response = await axios.post(`https://${BACKEND_URL}/admin/create`, {
                ...createQuiz
            })
    
            console.log(response)
    
            localStorage.setItem("admin-quiz", JSON.stringify({
                quizKey: response.data.roomKey,
                quizId: response.data.roomId,
                adminId: response.data.adminId,
                username: response.data.username
            }))
    
    
            router.push(`/admin/${response.data.roomId}`)
            setIsLoading(false)
            setIsOpen(false)
            setState(0)
            
        }catch(e){
            console.log(e)
            setIsLoading(false)
            setIsOpen(false)
            setState(0)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="font-bold">Host a Quiz</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>{state ? "Username" : "Select a Quiz to Host"}</DialogTitle>
                    <DialogDescription>
                        {state ? "Enter your Username to continue" : "Choose from our collection of quizzes or search for a specific one."}
                    </DialogDescription>
                </DialogHeader>
                <AnimatePresence mode="wait">
                    {state === 0 ? (
                        <motion.div
                            key="quiz-selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-4 py-4"
                        >
                            <ScrollArea className="h-[300px] rounded-md border p-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : error ? (
                                    <p className="text-center text-red-500">{error}</p>
                                ) : quizes.length === 0 ? (
                                    <p className="text-center text-muted-foreground">No quizzes found.</p>
                                ) : (
                                    <motion.div layout>
                                        {quizes.map((quiz) => (
                                            <motion.div
                                                key={quiz.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => handleClick(quiz.id)}
                                                className="flex cursor-pointer items-center space-x-4 rounded-lg border p-3 transition-colors hover:bg-accent mb-2"
                                            >
                                                <Image
                                                    src={quiz.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"}
                                                    alt={quiz.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-md object-cover"
                                                />
                                                <div>
                                                    <h3 className="font-medium">{quiz.name}</h3>
                                                    <p className="text-sm text-muted-foreground">ID: {quiz.id}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </ScrollArea>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="username-input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-4 py-4"
                        >
                            <div className="relative">
                                <AtSign className="absolute left-2 top-2.5 h-4 w-4" />
                                <Input
                                    placeholder="username"
                                    className="pl-8"
                                    value={createQuiz.username}
                                    onChange={handleUsernameChange}
                                />
                            </div>
                            <Button onClick={handleSubmit} className="mt-2 rounded-xl font-semibold" variant="default">
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Start the quiz"}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </DialogContent>

        </Dialog>
    )
}

