'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const messages = [
  "Welcome",
  "Loading",
  "Something Amazing",
  "Ready"
]

export default function ElegantPreloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    const timer = setTimeout(() => setIsLoading(false), 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  const currentMessageIndex = Math.min(
    Math.floor(progress / 25),
    messages.length - 1
  )

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
        >
          {/* Minimal background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#003087]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFB915]/5 rounded-full blur-3xl" />
          </div>

          {/* Main content */}
          <div className="relative flex flex-col items-center space-y-8">
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#003087] to-[#001a4d] rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-3xl font-light text-white">📚</span>
              </div>
              
              {/* Subtle pulse ring */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-[#003087]/20 rounded-2xl -z-10"
              />
            </motion.div>

            {/* Message */}
            <div className="h-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-lg text-gray-600 font-light tracking-wide"
                >
                  {messages[currentMessageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-gradient-to-r from-[#003087] to-[#FFB915] rounded-full"
              />
            </div>

            {/* Percentage */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-sm text-gray-400 font-mono"
            >
              {progress}%
            </motion.span>

            {/* Decorative dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-1 h-1 bg-[#003087]/30 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}