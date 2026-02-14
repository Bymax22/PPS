'use client'

import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/useMobile'
import { Calendar, MapPin, Users, Music, Trophy, Camera } from 'lucide-react'

interface Event {
  title: string
  date: string
  description: string
  type: string
}

interface CampusLifeProps {
  events?: Event[]
}

export default function CampusLife({ 
  events = [
    {
      title: "Open Day 2025",
      date: "March 15, 2025",
      description: "Tour our campus and meet our teachers",
      type: "admissions"
    },
    {
      title: "Sports Day",
      date: "April 10, 2025",
      description: "Annual inter-house sports competition",
      type: "sports"
    },
    {
      title: "Parent-Teacher Conference",
      date: "May 5, 2025",
      description: "Discuss your child's progress",
      type: "academic"
    }
  ]
}: CampusLifeProps) {
  const { isMobile } = useMobile()

  const activities = [
    {
      icon: Trophy,
      title: "Sports",
      description: "Football, basketball, swimming, athletics",
      color: "#0713FB"
    },
    {
      icon: Music,
      title: "Arts",
      description: "Music, drama, painting, choir",
      color: "#0EF117"
    },
    {
      icon: Users,
      title: "Clubs",
      description: "Debate, chess, robotics, environment",
      color: "#0713FB"
    },
    {
      icon: Camera,
      title: "Events",
      description: "Cultural day, prize-giving, concerts",
      color: "#0EF117"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-fluid">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className={cn(
            "font-playfair font-bold text-[#161A38] mb-4",
            isMobile ? "text-3xl" : "text-4xl md:text-5xl"
          )}>
            Life at <span className="text-[#0713FB]">Progress</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Beyond academics - a vibrant community where students discover their passions
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-4 md:p-6 text-center 
                  hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div 
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl mx-auto mb-3 
                    flex items-center justify-center transition-transform 
                    group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${activity.color}15` }}
                >
                  <Icon className="w-6 h-6 md:w-8 md:h-8" style={{ color: activity.color }} />
                </div>
                <h3 className="font-semibold text-[#161A38] mb-1 text-sm md:text-base">
                  {activity.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  {activity.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Events & Gallery */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-[#161A38] mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0713FB]" />
              Upcoming Events
            </h3>

            <div className="space-y-4">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl 
                    hover:bg-gray-100 transition-colors group"
                >
                  {/* Date */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#0713FB]">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#161A38] mb-1 group-hover:text-[#0713FB] 
                      transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {event.description}
                    </p>
                  </div>

                  {/* Type Badge */}
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    event.type === 'admissions' ? "bg-[#0713FB]/10 text-[#0713FB]" :
                    event.type === 'sports' ? "bg-[#0EF117]/10 text-[#161A38]" :
                    "bg-gray-200 text-gray-700"
                  )}>
                    {event.type}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-6 text-[#0713FB] text-sm font-medium hover:underline">
              View all events →
            </button>
          </div>

          {/* Photo Gallery Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-[#161A38] mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#0713FB]" />
              Campus Moments
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-square rounded-xl bg-gray-200 overflow-hidden group cursor-pointer"
                >
                  <div 
                    className="w-full h-full bg-cover bg-center transform group-hover:scale-110 
                      transition-transform duration-500"
                    style={{ backgroundImage: `url(/images/campus/gallery-${item}.jpg)` }}
                  />
                </div>
              ))}
            </div>

            <button className="mt-6 text-[#0713FB] text-sm font-medium hover:underline">
              View full gallery →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}