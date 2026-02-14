'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Award, Music, Palette, Trophy, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const events = [
  {
    id: 1,
    title: 'Annual Sports Day',
    date: 'June 15, 2024',
    time: '8:00 AM - 4:00 PM',
    location: 'School Sports Ground',
    description: 'A day of athletic competition and team spirit with races, relays, and field events for all grades.',
    category: 'Sports',
    icon: Trophy,
    image: '/images/events/sports-day.jpg',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'School Play: The Jungle Book',
    date: 'July 20, 2024',
    time: '2:00 PM & 6:00 PM',
    location: 'School Auditorium',
    description: 'Our drama club presents a magical adaptation of The Jungle Book. Come support our young performers!',
    category: 'Arts',
    icon: Music,
    image: '/images/events/school-play.jpg',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'Art Exhibition',
    date: 'August 10, 2024',
    time: '10:00 AM - 3:00 PM',
    location: 'Creative Arts Center',
    description: 'Showcasing artwork from students across all grades. Paintings, sculptures, and mixed media.',
    category: 'Arts',
    icon: Palette,
    image: '/images/events/art-exhibition.jpg',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 4,
    title: 'Parent-Teacher Conference',
    date: 'August 25, 2024',
    time: '2:00 PM - 7:00 PM',
    location: 'School Campus',
    description: 'Meet with teachers to discuss student progress and development for Term 2.',
    category: 'Academic',
    icon: Users,
    image: '/images/events/parent-teacher.jpg',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 5,
    title: 'Prize Giving Day',
    date: 'December 5, 2024',
    time: '9:00 AM - 1:00 PM',
    location: 'School Hall',
    description: 'Celebrating student achievements and academic excellence for the academic year.',
    category: 'Academic',
    icon: Award,
    image: '/images/events/prize-giving.jpg',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 6,
    title: 'Open Day',
    date: 'September 15, 2024',
    time: '9:00 AM - 3:00 PM',
    location: 'School Campus',
    description: 'Prospective families welcome! Tour our facilities, meet teachers, and learn about our programs.',
    category: 'Community',
    icon: Users,
    image: '/images/events/open-day.jpg',
    color: 'from-indigo-500 to-purple-500'
  }
]

const categories = ['All', 'Academic', 'Sports', 'Arts', 'Community']

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory)

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
            Stay Connected
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Events Calendar
          </h1>
          <p className="text-lg text-gray-600">
            Join us for upcoming events, celebrations, and community gatherings
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 rounded-full text-sm font-semibold transition-all
                ${selectedCategory === category
                  ? 'bg-[var(--campus-gold)] text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredEvents.map((event, index) => {
            const Icon = event.icon
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${event.color}`}>
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[var(--campus-gold)]" />
                      <span className="text-gray-600">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-[var(--campus-gold)]" />
                      <span className="text-gray-600">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-[var(--campus-gold)]" />
                      <span className="text-gray-600">{event.location}</span>
                    </div>
                  </div>
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center gap-1 text-[#003087] font-semibold text-sm hover:text-[var(--campus-gold)] transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-2">Download Full Calendar</h2>
              <p className="text-gray-200">Get the complete academic year calendar with all events</p>
            </div>
            <button className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors whitespace-nowrap">
              Download PDF Calendar
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}