'use client'

import { useState, useEffect } from 'react'
import { FaTrophy, FaStar, FaMedal, FaChartLine, FaAward } from 'react-icons/fa'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  earned: boolean
  progress: number
  threshold: number
  earnedAt?: string
}

interface XPData {
  currentXP: number
  totalXP: number
  level: number
  nextLevelXP: number
  progress: number
  rank: string
  dailyStreak: number
}

export default function GamificationPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [xpData, setXpData] = useState<XPData | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const [badgesResponse, xpResponse] = await Promise.all([
          fetch('/api/student/badges'),
          fetch('/api/student/xp')
        ])
        
        const badgesData = await badgesResponse.json()
        const xpData = await xpResponse.json()
        
        setBadges(badgesData)
        setXpData(xpData)
      } catch (error) {
        console.error('Error fetching gamification data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGamificationData()
  }, [])

  const categories = ['all', 'academic', 'participation', 'mastery', 'collaboration']
  const filteredBadges = activeCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === activeCategory)

  const earnedBadges = badges.filter(badge => badge.earned)
  const progressBadges = badges.filter(badge => !badge.earned && badge.progress > 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0713FB]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gamification</h1>
        <p className="text-gray-600 mt-1">Earn badges, level up, and track your progress</p>
      </div>

      {/* XP Progress */}
      {xpData && (
        <div className="bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <FaTrophy className="text-2xl text-yellow-400" />
                <div>
                  <div className="text-sm opacity-90">Level {xpData.level} • {xpData.rank}</div>
                  <div className="text-2xl font-bold">{xpData.currentXP} XP</div>
                </div>
              </div>
              <div className="text-sm opacity-90">
                Daily Streak: {xpData.dailyStreak} days 🔥
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span>Level {xpData.level}</span>
                <span>{xpData.currentXP}/{xpData.nextLevelXP} XP</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${xpData.progress}%` }}
                ></div>
              </div>
              <div className="text-xs opacity-90 mt-1 text-center">
                {xpData.nextLevelXP - xpData.currentXP} XP to Level {xpData.level + 1}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <FaAward className="text-3xl text-[#0713FB] mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{earnedBadges.length}</div>
          <div className="text-sm text-gray-600">Badges Earned</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{xpData?.level}</div>
          <div className="text-sm text-gray-600">Current Level</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <FaMedal className="text-3xl text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{progressBadges.length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <FaChartLine className="text-3xl text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{xpData?.dailyStreak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Badges Collection</h2>
          <p className="text-gray-600 text-sm mt-1">
            Complete challenges to unlock achievements and earn rewards
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex space-x-1 p-4 border-b border-gray-200">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeCategory === category
                  ? 'bg-[#0713FB] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBadges.map(badge => (
              <div
                key={badge.id}
                className={`border-2 rounded-xl p-4 text-center transition-all ${
                  badge.earned
                    ? 'border-[#0EF117] bg-green-50'
                    : 'border-gray-200 bg-white opacity-60'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3 ${
                    badge.earned ? badge.color : 'bg-gray-400'
                  }`}
                >
                  {badge.icon}
                </div>

                {/* Badge Info */}
                <h3 className="font-semibold text-gray-900 mb-1">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>

                {/* Progress */}
                {!badge.earned && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#0713FB] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${badge.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {badge.progress}% complete
                    </div>
                  </div>
                )}

                {/* Earned Status */}
                {badge.earned && badge.earnedAt && (
                  <div className="text-xs text-green-600 font-medium">
                    Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredBadges.length === 0 && (
            <div className="text-center py-12">
              <FaAward className="text-4xl text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No badges found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category or complete more activities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}