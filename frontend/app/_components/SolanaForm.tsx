'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Mail, Key, User, Loader2 } from 'lucide-react'

export function SolanaForm() {
    const [userInput, setUserInput] = useState({
        publicKey: "",
        email: "",
        username: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const animations = {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setUserInput((value) => ({
            ...value,
            [e.target.name]: e.target.value
        }))
    }

    async function handleJoin() {
        setIsLoading(true)
        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            localStorage.setItem("quiz", JSON.stringify({
                key: "sample-key",
                userId: "sample-user-id",
                quizId: "sample-quiz-id"
            }))

            router.push(`/join/sample-quiz-id`)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div className="w-full space-y-6" {...animations}>
            <h2 className="text-3xl font-bold text-white text-center mb-6">Solana Quiz Entry</h2>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-teal-200 font-medium" htmlFor="email">Email</Label>
                    <div className="relative">
                        <Input 
                            className="bg-white/20 border-2 border-teal-300/50 rounded-xl text-white placeholder-teal-200/70 pl-10" 
                            onChange={handleChange} 
                            placeholder="your@email.com" 
                            type="email" 
                            id="email" 
                            name="email"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300" size={18} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-teal-200 font-medium" htmlFor="publicKey">Public Key</Label>
                    <div className="relative">
                        <Input 
                            className="bg-white/20 border-2 border-teal-300/50 rounded-xl text-white placeholder-teal-200/70 pl-10" 
                            onChange={handleChange} 
                            placeholder="Solana Public Key" 
                            type="text" 
                            id="publicKey" 
                            name="publicKey" 
                        />
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300" size={18} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-teal-200 font-medium" htmlFor="username">Username</Label>
                    <div className="relative">
                        <Input 
                            className="bg-white/20 border-2 border-teal-300/50 rounded-xl text-white placeholder-teal-200/70 pl-10" 
                            onChange={handleChange} 
                            placeholder="@YourUsername" 
                            value={userInput.username}
                            type="text" 
                            id="username" 
                            name="username" 
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300" size={18} />
                    </div>
                </div>
            </div>

            <Button 
                onClick={handleJoin}
                disabled={isLoading} 
                className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl py-6 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    "Join Quiz"
                )}
            </Button>
        </motion.div>
    )
}

