'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, ChevronRight, Newspaper } from 'lucide-react'

const news = [
  {
    id: 1,
    title: 'Progress School Achieves 100% Pass Rate in ECZ Examinations',
    excerpt: 'Our Grade 7 students have achieved outstanding results in the 2023 ECZ examinations, with all students qualifying for secondary school.',
    date: 'December 15, 2023',
    author: 'Academic Office',
    image: '/images/news/exam-results.jpg',
    category: 'Achievement'
  },
  {
    id: 2,
    title: 'New Science Laboratory Opens',
    excerpt: 'We are excited to announce the opening of our new state-of-the-art science laboratory, equipped for hands-on learning in physics, chemistry, and biology.',
    date: 'November 10, 2023',
    author: 'Facilities Team',
    image: '/images/news/science-lab.jpg',
    category: 'Facilities'
  },
  {
    id: 3,
    title: 'Cambridge Recognition Award',
    excerpt: 'Progress Preparatory School receives Cambridge Dedicated School Award for excellence in international education.',
    date: 'October 22, 2023',
    author: 'Administration',
    image: '/images/news/cambridge-award.jpg',
    category: 'Award'
  },
  {
    id: 4,
    title: 'Sports Day 2023: A Celebration of Athletics',
    excerpt: 'Students showcased their athletic talents at our annual Sports Day, with record-breaking performances and great sportsmanship.',
    date: 'June 20, 2023',
    author: 'Sports Department',
    image: '/images/news/sports-day.jpg',
    category: 'Event'
  },
  {
    id: 5,
    title: 'Parent-Teacher Association Elects New Committee',
    excerpt: 'The PTA has elected new leadership for the 2024 academic year, committed to strengthening school-family partnerships.',
    date: 'May 5, 2023',
    author: 'PTA',
    image: '/images/news/pta.jpg',
    category: 'Community'
  },
  {
    id: 6,
    title: 'Students Participate in National Science Fair',
    excerpt: 'Our young scientists represented the school at the National Science Fair, winning awards in the junior category.',
    date: 'April 12, 2023',
    author: 'Science Department',
    image: '/images/news/science-fair.jpg',
    category: 'Achievement'
  }
]

export default function NewsPage() {
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
            Latest Updates
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            News & Announcements
          </h1>
          <p className="text-lg text-gray-600">
            Stay informed about the latest happenings at Progress Preparatory School
          </p>
        </motion.div>

        {/* Featured News */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="relative h-[400px] rounded-3xl overflow-hidden group">
            <Image
              src={news[0].image}
              alt={news[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003087] via-[#003087]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white max-w-2xl">
              <span className="px-3 py-1 bg-[var(--campus-gold)] text-gray-900 rounded-full text-xs font-semibold mb-4 inline-block">
                Featured
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{news[0].title}</h2>
              <p className="text-gray-200 mb-4">{news[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {news[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {news[0].author}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {news.slice(1).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[var(--campus-gold)] text-gray-900 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    <span className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {item.author}
                    </span>
                  </div>
                  <Link
                    href={`/news/${item.id}`}
                    className="text-[#003087] hover:text-[var(--campus-gold)] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-3xl p-8 text-center"
        >
          <Newspaper className="w-12 h-12 text-[var(--campus-gold)] mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-[#003087] mb-2">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get the latest news and updates delivered directly to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
            />
            <button className="px-6 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}