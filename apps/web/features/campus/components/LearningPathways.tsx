'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Lightbulb, Users } from 'lucide-react'

const values = [
  { icon: Heart, title: 'Integrity', desc: 'Doing what is right, even when no one is watching.' },
  { icon: Shield, title: 'Resilience', desc: 'Overcoming challenges with courage and determination.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Thinking creatively to solve the problems of tomorrow.' },
  { icon: Users, title: 'Community', desc: 'Building a supportive and inclusive family.' },
]

export default function LearningPathways() {
  return (
    <section className="py-24 md:py-32 bg-[#003087] text-white relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 border border-white rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4"
          >
            Our Core Values
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold leading-tight"
          >
            Character is the Foundation
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 group"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-[var(--campus-gold)] mb-6 
                              transition-transform duration-500 group-hover:scale-110 group-hover:bg-[var(--campus-gold)]"
              >
                <value.icon className="w-8 h-8 text-[var(--campus-gold)] transition-colors duration-500 group-hover:text-[#003087]" />
              </div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}