import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { motion } from "motion/react";
import { AtSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../types/type";

export function NormalForm({userInput, setUserInput}: {userInput: {
    key: string;
    username: string;
    quizId: string
}, setUserInput : Dispatch<SetStateAction<{
    key: string;
    username: string;
    quizId: string
}>>}) {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleSubmit () {
        setIsLoading(true)
        if (!userInput.username) {
            toast.error("Please add your username", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff"
                }
            })
            setIsLoading(false)
            return
        }
        try{
            const response = await axios.post(`https://${BACKEND_URL}/user/join`, {
                quizKey: parseInt(userInput.key),
                username: userInput.username,
                quizId: userInput.quizId
            })
    
            if (response.status === 200) {
                localStorage.setItem("user-quiz", JSON.stringify({
                    quizKey: parseInt(userInput.key),
                    userId: response.data.userId,
                    quizId: userInput.quizId
                }))
                router.push(`/join/${userInput.quizId}`)
            }
            setIsLoading(false)
            return
        }catch(e){
            toast.error("Something went wrong", {
                style: {
                    borderRadius: "10px",
                    background : "#333",
                    color: "#fff"
                }
            })
            router.push("/")
            setIsLoading(false)
            return
        }

    }

    function handleChange (e: ChangeEvent<HTMLInputElement>) {

        setUserInput((prev) => {
            return{
                ...prev, 
            username: e.target.value
            }
        })

    }
    
    const animations = {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }
    }
    
    return(
        <motion.div {...animations}>
            <div>
                <div className="text-center mb-2 text-xl font-bold">
                    Enter your name
                </div>
                <div className="relative">
                <Input className="px-12 rounded-lg border border-2 h-11" onChange={(e) => handleChange(e)} placeholder="Khalifa" type="text" id="username" name="username" />
                <AtSign className="absolute left-0 top-0 w-11 py-1 px-3 rounded-lg h-11 text-muted-foreground bg-neutral-800"/>
                </div>
                <Button onClick={handleSubmit} variant={"secondary"} className="mt-4 py-4 w-full text-center border hover:border-neutral-100 ">
                    {isLoading ?  <Loader2 className="mr-2 h-5 w-5 animate-spin" />: "Enter in the arena"}
                    </Button>
            </div>
        </motion.div>
    )

}