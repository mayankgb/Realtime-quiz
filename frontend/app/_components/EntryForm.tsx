'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2 } from 'lucide-react'
import { SolanaForm } from './SolanaForm'
import { NormalForm } from './NormalForm'
import { AnimatePresence, motion } from "framer-motion"
import axios from 'axios'

export default function QuizEntry() {
  const [quizKey, setQuizKey] = useState({
    key: '',
    username: '',
    quizId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSolana, setIsSolana] = useState<0 | 1 | 2>(0)

  const handleClick = async () => {
    try {
      if (quizKey.key.length === 0) {
        return
      }
      setIsLoading(true)
      // Simulating API call
      const response = await axios.post("http://localhost:8000/user/getquiz",{
        key: parseInt(quizKey.key)
      })
      
      setQuizKey((prev) => {
        return {
          ...prev,
          quizId: response.data.quizId
        }
      })
  
        setIsSolana(1)
        setIsLoading(false)
    }catch(e) {
      setIsLoading(false)
    }
  }

  const animations = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl">
        <AnimatePresence mode='wait' initial={false}>
          {isSolana === 0 ? (
            <motion.div key="quiz-entry" {...animations} className='flex flex-col w-full space-y-6'>
              <h1 className='text-4xl font-bold text-white text-center'>
                Join Quiz
              </h1>
              <div className='space-y-2'>
                <Label htmlFor='key' className='text-teal-200 font-medium'>Quiz Key</Label>
                <Input 
                  value={quizKey.key} 
                  onChange={(e) => setQuizKey((prev) => {
                    return {
                      ...prev,
                      key: e.target.value
                    }
                  })} 
                  name='key' 
                  className='bg-white/20 border-2 border-teal-300/50 rounded-xl text-white placeholder-teal-200/70'
                  placeholder='Enter the quiz key' 
                  type='text' 
                />
              </div>
              <Button 
                onClick={handleClick} 
                disabled={isLoading}
                className='w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl py-6 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105'
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Join <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          ) : isSolana === 2 ? (
            <SolanaForm key="solana" />
          ) : (
            <NormalForm userInput={quizKey} setUserInput={setQuizKey} key="normal" />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

