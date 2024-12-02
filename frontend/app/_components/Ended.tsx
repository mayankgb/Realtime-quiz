import { motion } from 'framer-motion';
import { Trophy, Check } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { totalPlayers } from '../store/state';

const QuizEndScreen = () => {

    const playerCount = useRecoilValue(totalPlayers)

  return (
    <div className="flex-1 bg-black flex flex-col items-center justify-center text-white p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-900 rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-2xl w-full"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <Trophy className="mx-auto mb-6 text-zinc-300" size={80} strokeWidth={1} />
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-100">
            Quiz Completed
          </h1>
          
          <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
            Thank you to all participants who brought their passion, knowledge, and enthusiasm to our quiz today
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
            <div className="flex items-center bg-zinc-800 rounded-full px-4 py-2">
              <Check className="mr-2 text-zinc-300" size={24} />
              <span className="text-zinc-500">Total Participants</span>
              <span className="ml-2 font-bold text-white">{playerCount}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-10" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
    </div>
  );
};

export default QuizEndScreen;