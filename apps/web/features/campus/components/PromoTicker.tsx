"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import {
  GraduationCap,
  Globe,
  School,
  BookOpen,
  Laptop,
  Users
} from "lucide-react"

type Promo = {
  text: string
  icon: React.ElementType
}

const promos: Promo[] = [
  {
    text: "Internationally Recognised Curriculum",
    icon: GraduationCap
  },
  {
    text: "Physical & Virtual Learning Options Available",
    icon: Globe
  },
  {
    text: "Modern Facilities & Smart Classrooms",
    icon: School
  },
  {
    text: "Holistic Education – Academics, Arts & Sports",
    icon: BookOpen
  },
  {
    text: "Digital Learning Platforms & Innovation Labs",
    icon: Laptop
  },
  {
    text: "Strong Community & Global Partnerships",
    icon: Users
  }
]

export default function PromoTicker() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % promos.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = promos[index].icon

  return (
    <div className="flex items-center justify-center w-full h-7 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#FFB915] whitespace-nowrap"
        >
          <CurrentIcon size={16} strokeWidth={2.5} />
          <span>{promos[index].text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
