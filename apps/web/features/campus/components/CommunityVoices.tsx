'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "The teachers here don't just teach; they inspire. My children have grown not just academically but as global citizens.",
    author: "Mrs. Mwamba",
    role: "Parent, Grade 5",
    image: "/images/parent1.jpg"
  },
  {
    quote: "Progress gave me the confidence to pursue engineering. The lab facilities and support were exceptional.",
    author: "Chisha Musonda",
    role: "Alumni, Class of 2020",
    image: "/images/alumni1.jpg"
  }
]

export default function CommunityVoices() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
            Community Voices
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#003087]">
            Hear From Our Family
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 relative"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-gray-100" />
              
              <p className="text-lg text-gray-600 italic mb-8 leading-relaxed relative z-10">
                "{item.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                  <Image 
                    src={item.image} 
                    alt={item.author} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-[#003087]">{item.author}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}