'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'

const messages = [
  "Preparing global citizens...",
  "Nurturing young minds...",
  "Building future leaders...",
  "Excellence in education..."
]

export default function BookPreloaderSoft() {
  const [isLoading, setIsLoading] = useState(true)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isBookOpen, setIsBookOpen] = useState(false)

  useEffect(() => {
    const openTimer = setTimeout(() => setIsBookOpen(true), 400)
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 1500)
    const loaderTimer = setTimeout(() => setIsLoading(false), 4000)

    return () => {
      clearTimeout(openTimer)
      clearInterval(messageTimer)
      clearTimeout(loaderTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Localized blur effect - like a vignette */}
          <div className="fixed inset-0 z-[100] pointer-events-none">
            <div className="absolute inset-0 bg-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent backdrop-blur-xl rounded-full"
                style={{
                  boxShadow: '0 0 100px rgba(0,0,0,0.1)',
                  filter: 'blur(15px)'
                }}
              />
            </div>
          </div>

          {/* Centered Content */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative flex flex-col items-center"
            >
              {/* Animated Book */}
              <motion.div
                animate={{
                  rotateY: isBookOpen ? 180 : 0,
                  scale: isBookOpen ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
                className="relative w-24 h-24 mb-6"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front Cover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-2xl shadow-2xl flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <BookOpen className="w-8 h-8 text-[var(--campus-gold)]" />
                </motion.div>

                {/* Inside Pages */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-2xl flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="relative">
                    <BookOpen className="w-8 h-8 text-[#003087]" />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -inset-2 bg-[var(--campus-gold)]/20 blur-xl rounded-full"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Message Container */}
              <div className="relative">
                {/* Soft glow behind text */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-[var(--campus-gold)]/10 blur-2xl rounded-full"
                />

                {/* Message */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={messageIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-lg font-medium text-[#003087] text-center whitespace-nowrap px-6"
                      style={{ textShadow: '0 2px 4px rgba(255,215,0,0.2)' }}
                    >
                      {messages[messageIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Minimal Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {messages.map((_, index) => (
                    <motion.div
                      key={index}
                      animate={{
                        width: index === messageIndex ? 20 : 6,
                        backgroundColor: index === messageIndex ? '#FFB915' : '#CBD5E0'
                      }}
                      className="h-1.5 rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}