"use client"
import { useRecoilValue } from 'recoil';
import { AnimatePresence, motion } from 'framer-motion';
import { leaderBoard, userPosition } from '../store/state';
import { Trophy, User, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Result({ isAdmin }: { isAdmin: boolean }) {
  const currentLeaderBoard = useRecoilValue(leaderBoard);
  const userData = JSON.parse(localStorage.getItem("user-quiz") || '{}') as { quizKey: number, userId: string, quizId: string }
  const userSubmission = useRecoilValue(userPosition)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowResult(true)
    }, 3 * 1000)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className={`h-[90%] flex items-center justify-center w-full`}>

      <AnimatePresence mode='wait'>

        {
          showResult ? <div className="w-full pb-2 slim-scrollbar max-w-md mx-auto max-h-[80%] overflow-auto px-4 bg-white rounded-lg shadow-lg">
            <div className="flex sticky bg-white bg-opacity-10 backdrop-blur-sm  p-2 h-20 top-0 items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {currentLeaderBoard?.map((user, index) => (
                <motion.div
                  key={user.id}
                  variants={itemVariants}
                  className={`flex items-center p-4 rounded-lg transition-all duration-300 
              ${userData.userId === user.id
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  {/* Ranking Badge */}
                  <div className="mr-4">
                    {index === 0 ? (
                      <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center 
                  text-gray-600 font-bold text-sm bg-gray-300 rounded-full">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* User Avatar or Placeholder */}
                  <div className="mr-4">
                    {(
                      <User className="w-10 h-10 text-gray-500 bg-gray-200 rounded-full p-2" />
                    )}
                  </div>

                  {/* Username and Score */}
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-600">Score: {user.points}</div>
                  </div>

                  {/* Highlight Current User */}
                  {userData.userId === user.id && (
                    <div className="ml-2 text-blue-600 font-bold">You</div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div> : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, origin: "center", transition: { ease: 'easeInOut', duration: 0.4 } }} exit={{ scale: 0 }} className=' flex justify-center items-center'>
              {isAdmin ?
                <div className='flex flex-col items-center p-2 h-28 justify-around '>
                  <div className='text-4xl font-semibold text-slate-400'>Time&aps;s up</div>
                </div>
                : (
                  <div className='flex flex-col items-center p-2 h-28 justify-around '>
                    <div className='text-4xl font-semibold text-slate-400'>
                      {userSubmission?.isCorrect.toUpperCase()}!
                    </div>
                    <div className='text-2xl'>
                      Your points {userSubmission?.userPoints}
                    </div>
                  </div>
                )}
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  );
}

export default Result;