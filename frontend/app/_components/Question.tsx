import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { currentQuestion, currentState, ws } from "../store/state"
// import { sampleQuestion } from "../sample"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Question({ isAdmin }: { isAdmin: boolean }) {
  const [newQuestion, setNewQuestion] = useRecoilState(currentQuestion)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [points, setPoints] = useState(newQuestion?.points!)
  const setState = useSetRecoilState(currentState)
  const [newIndex, setNewIndex] = useState<number>()
  const [timeRemaining, setTimeRemaining] = useState((new Date().getTime() + (10 * 1000) - newQuestion?.startTime!) / 1000)
  const userWs = useRecoilValue(ws)
  const router = useRouter()

  // Points and timer reduction effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer)
          handleSubmit(false)
          return 0
        }
        return prevTime - 1
      })

      // Linearly reduce points from 1000 to 500 over 10 seconds
      setPoints(prevPoints => {
        const newPoints = prevPoints - 50
        return newPoints < 500 ? 500 : newPoints
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function handleOptionSelect(index: number, optionIndex: number) {
    if (index === selectedIndex) {
      return
    }
    setSelectedIndex(index)
    setNewIndex(optionIndex)
  }

  function handleSubmit(value: boolean) {

    if (value) {
      const data = JSON.parse(localStorage.getItem("user-quiz") || "") as { userId: string, quizId: string, quizKey: string } | null
      console.log("inside")

      if (!data) {
        localStorage.clear()
        router.push("/join")
        console.log("data")
        return
      }

      console.log(userWs)

      userWs?.send(JSON.stringify({
        type: "Submission",
        userId: data.userId,
        roomId: data.quizId,
        roomKey: parseInt(data.quizKey),
        questionId: newQuestion?.id,
        index: newIndex
      }))
    }

    console.log("bhar")
    setState("Submitted")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
      {/* Points Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">Points</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-emerald-400">{Math.round(points)}</span>
            <span className="text-sm text-gray-400">| {timeRemaining}s</span>
          </div>
        </div>
        <Progress
          value={(points - 500) / 5}
          className="h-2 bg-neutral-700"
        />
      </div>

      {/* Question */}
      <div className="bg-neutral-800 rounded-2xl p-6 mb-6 border border-neutral-700 shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-100 mb-6 tracking-tight">
          {newQuestion?.question}
        </h2>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newQuestion?.options.map((value, index) => (
            <button
              key={index}
              disabled={ isAdmin }
              onClick={() => handleOptionSelect(index, value.index)}
              className={`
                w-full text-left p-4 rounded-xl transition-all duration-200 ease-in-out
                ${selectedIndex === index
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-500'
                  : 'bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:text-white'}
                flex items-center space-x-3
              `}
            >
              <span
                className={`
                  w-7 h-7 rounded-full border-2 flex items-center justify-center font-semibold
                  ${selectedIndex === index
                    ? 'bg-white text-emerald-600 border-white'
                    : 'border-neutral-600 text-gray-400'}
                `}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="font-medium tracking-tight">{value.text}</span>
              {selectedIndex === index && (
                <CheckCircle2 className="ml-auto w-5 h-5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => handleSubmit(true)}
          disabled={selectedIndex === null || isAdmin}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl 
                     disabled:bg-neutral-700 disabled:cursor-not-allowed 
                     transition-all duration-200 text-lg font-semibold tracking-wider"
        >
          Submit Answer
        </Button>
      </div>
    </div>
  )
}

export default Question