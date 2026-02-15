'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function MinimalPreloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm"
        >
          <div className="relative flex flex-col items-center">
            {/* Animated rings */}
            <div className="relative w-24 h-24 mb-8">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-[#003087]/20 border-t-[#003087]"
              />
              
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-2 border-[#FFB915]/20 border-b-[#FFB915]"
              />
              
              {/* Center dot */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-8 bg-gradient-to-br from-[#003087] to-[#FFB915] rounded-full"
              />
            </div>

            {/* Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-500 tracking-widest uppercase"
            >
              Loading
            </motion.p>

            {/* Dots */}
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="text-[#003087]"
                >
                  .
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}