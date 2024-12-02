"use client"

import React from 'react'
import { useRecoilValue } from 'recoil'
import { roomKey, totalPlayers, ws } from '../store/state'
import { motion } from 'framer-motion'
import { Users, PlayCircle, Clock, Divide } from 'lucide-react'

interface Player {
  id: string
  name: string
  avatar: string
  rank: number
}

export function Waiting({ isAdmin } : { isAdmin: boolean }) {
  const playerCount = useRecoilValue(totalPlayers)
  const adminWs = useRecoilValue(ws)
  const maxPlayers = 100 // Assuming a maximum of 100 players

  const quizKey = useRecoilValue(roomKey)

  // const ad,
  function handleKeyDown (e: React.KeyboardEvent<HTMLDivElement>){
    const data = JSON.parse(localStorage.getItem("admin-quiz") || "") as {quizKey: string , quizId: string, adminId: string, username: string} || null

    if (!data) {
      return
    }

    if (e.key === "Enter" && isAdmin) {
      adminWs?.send(JSON.stringify({
        type: "next",
        adminId: data.adminId, 
        roomKey: data.quizKey,
        roomId: data.quizId
      }))
      
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  }

  return (
    <div 
      tabIndex={0} 
      onKeyDown={handleKeyDown} 
      className='flex-1 flex items-center justify-center  bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='relative flex flex-col items-center justify-center space-y-6 p-10 bg-gray-800/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 w-full max-w-md'
      >
        {/* Animated Title */}
        <motion.div 
          variants={itemVariants}
          className='flex items-center space-x-3'
        >
          <Clock className="w-8 h-8 text-blue-500 animate-pulse" />
          <h1 className='text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600'>
            Waiting Room
          </h1>
        </motion.div>
        
        {/* Player Count */}
        <motion.div 
          variants={itemVariants}
          className='flex items-center space-x-2 bg-gray-700/50 px-4 py-2 rounded-full'
        >
          <Users className="w-5 h-5 text-green-400" />
          <div className='text-xl font-semibold text-gray-200'>
            Players: 
            <span className='ml-2 text-green-400'>
              {playerCount}
              <span className='text-sm text-gray-400'>/{maxPlayers}</span>
            </span>
          </div>
        </motion.div>

        {/* Loading Animation */}
        <motion.div 
          variants={itemVariants}
          className='flex space-x-3 justify-center items-center'
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div 
              key={i} 
              className='w-3 h-3 bg-blue-500 rounded-full'
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                delay: i * 0.2,
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Description */}
       {quizKey && <div> RoomKey: {quizKey}</div>}
        <motion.p 
          variants={itemVariants}
          className='text-gray-400 text-sm text-center max-w-xs flex items-center space-x-2'
        >
          <PlayCircle className="w-4 h-4 text-blue-500" />
          <span>The quiz will begin once all players have joined. Get ready!</span>
        </motion.p>

        {/* Admin Start Button (Optional) */}
        {isAdmin && (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold flex items-center space-x-2 transition-all'
          >
            <PlayCircle className="w-5 h-5" />
            <span>Start Game</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}

export default Waiting