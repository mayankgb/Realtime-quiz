import { useRecoilValue } from "recoil"
import { currentQuestion } from "../store/state"

export default function Submitted({ 
  timedOut = false 
}: { 
  timedOut?: boolean 
}) {

  const question = useRecoilValue(currentQuestion)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {timedOut ? (
          <div className="text-gray-200 text-2xl font-semibold flex flex-col items-center space-y-4">
            <span className="text-6xl">😔</span>
            <span>Oh, you missed this!</span>
            <span className="text-base text-gray-400">Time's up ⏰</span>
          </div>
        ) : (
          <div className="text-gray-200 text-2xl font-semibold flex flex-col items-center space-y-4">
            <span className="text-6xl">🎉</span>
            <span>Great Job!</span>
            <span className="text-base text-gray-400">
              You submitted the answer in {((new Date().getTime() - question!.startTime)/1000).toFixed(2)} seconds ✨
            </span>
          </div>
        )}
      </div>
    </div>
  )
}