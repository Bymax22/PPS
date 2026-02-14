'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail, Linkedin, Twitter } from 'lucide-react'

const leadership = [
  {
    name: 'Mr Francis Siakumena',
    position: 'School Director',
    bio: 'With over 10 years of experience in education, Mr. Siakumena leads our school with vision and passion for academic excellence.',
    image: '/images/file.jpg',
    qualifications: 'Degree in Education and Systems'
  },


]

export default function LeadershipPage() {
  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
            Our Team
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            School Leadership
          </h1>
          <p className="text-lg text-gray-600">
            Meet the dedicated professionals guiding our school towards excellence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {leadership.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                <p className="text-[var(--campus-gold)] font-semibold text-sm mb-3">{person.position}</p>
                <p className="text-sm text-gray-500 mb-3">{person.qualifications}</p>
                <p className="text-gray-600 text-sm mb-4">{person.bio}</p>
                <div className="flex gap-3">
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-[#003087] hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-[#003087] hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-[#003087] hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}