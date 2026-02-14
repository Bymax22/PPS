'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Music, Palette, Trophy, Mic, Theater, Camera, Heart, Users, Award, Calendar } from 'lucide-react'

export default function ActivitiesPage() {
  const categories = [
    {
      title: 'Sports',
      icon: Trophy,
      color: 'from-blue-500 to-cyan-500',
      activities: ['Football', 'Swimming', 'Basketball', 'Athletics', 'Netball'],
      image: '/images/sports.jpg'
    },
    {
      title: 'Arts',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      activities: ['Painting', 'Drawing', 'Crafts', 'Sculpture', 'Design'],
      image: '/images/arts.jpg'
    },
    {
      title: 'Music',
      icon: Music,
      color: 'from-emerald-500 to-teal-500',
      activities: ['Choir', 'Instrumental', 'Theory', 'Band', 'Percussion'],
      image: '/images/music.jpg'
    },
    {
      title: 'Drama',
      icon: Theater,
      color: 'from-amber-500 to-orange-500',
      activities: ['School Plays', 'Drama Club', 'Stage Production', 'Public Speaking', 'Debate'],
      image: '/images/drama.jpg'
    },
    {
      title: 'Clubs',
      icon: Users,
      color: 'from-red-500 to-rose-500',
      activities: ['Chess Club', 'Debate Club', 'Environment Club', 'Robotics', 'Book Club'],
      image: '/images/clubs.jpg'
    },
    {
      title: 'Community',
      icon: Heart,
      color: 'from-indigo-500 to-purple-500',
      activities: ['Community Service', 'Fundraising', 'Peer Mentoring', 'School Leadership', 'Charity Events'],
      image: '/images/community.jpg'
    }
  ]

  const upcoming = [
    {
      event: 'Sports Day',
      date: 'June 15, 2024',
      description: 'Annual athletics competition for all grades'
    },
    {
      event: 'School Play',
      date: 'July 20, 2024',
      description: 'Drama club presents "The Jungle Book"'
    },
    {
      event: 'Art Exhibition',
      date: 'August 10, 2024',
      description: 'Showcasing student artwork from all grades'
    },
    {
      event: 'Music Concert',
      date: 'September 5, 2024',
      description: 'End-of-term choir and band performance'
    }
  ]

  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
            Beyond Academics
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Co-Curricular Activities
          </h1>
          <p className="text-lg text-gray-600">
            Developing well-rounded students through diverse extracurricular opportunities
          </p>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`} />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Icon className="w-8 h-8 mb-2" />
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {category.activities.map((activity, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcoming.map((event, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--campus-gold)]/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-[var(--campus-gold)]" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{event.event}</h3>
                    <p className="text-sm text-[var(--campus-gold)] mb-2">{event.date}</p>
                    <p className="text-xs text-gray-200">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
            >
              View Full Calendar
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}