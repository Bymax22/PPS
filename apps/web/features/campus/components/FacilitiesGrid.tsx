'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/useMobile'
import { 
  School, FlaskConical, Trophy, BookOpen, Monitor, Palette, 
  ChevronRight, Maximize2, X 
} from 'lucide-react'

interface Facility {
  title: string
  description: string
  icon: string
  image: string
  features: string[]
}

interface FacilitiesGridProps {
  facilities?: Facility[]
}

export default function FacilitiesGrid({ 
  facilities = [
    {
      title: "Modern Classrooms",
      description: "Smart boards, flexible seating, and collaborative learning spaces",
      icon: "School",
      image: "/images/campus/classroom.jpg",
      features: ["Interactive whiteboards", "Ergonomic furniture", "AC classrooms"]
    },
    {
      title: "Science Laboratories",
      description: "Fully equipped labs for Physics, Chemistry, and Biology",
      icon: "Flask",
      image: "/images/campus/lab.jpg",
      features: ["Modern equipment", "Safety first", "Practical experiments"]
    },
    {
      title: "Sports Complex",
      description: "Indoor and outdoor facilities for various sports",
      icon: "Trophy",
      image: "/images/campus/sports.jpg",
      features: ["Basketball court", "Football field", "Swimming pool"]
    }
  ]
}: FacilitiesGridProps) {
  const { isMobile } = useMobile()
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'School': return School
      case 'Flask': return FlaskConical
      case 'Trophy': return Trophy
      case 'BookOpen': return BookOpen
      case 'Monitor': return Monitor
      case 'Palette': return Palette
      default: return School
    }
  }

  return (
    <>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-fluid">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className={cn(
              "font-playfair font-bold text-[#161A38] mb-4",
              isMobile ? "text-3xl" : "text-4xl md:text-5xl"
            )}>
              Our <span className="text-[#0713FB]">Campus</span> Facilities
            </h2>
            <p className="text-gray-600 text-lg">
              Purpose-built learning environments designed to inspire and nurture young minds
            </p>
          </div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => {
              const Icon = getIcon(facility.icon)
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg 
                    hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-[#0713FB]/20 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 z-10" />
                    <div 
                      className="w-full h-full bg-cover bg-center transform group-hover:scale-110 
                        transition-transform duration-500"
                      style={{ backgroundImage: `url(${facility.image})` }}
                    />
                    <button
                      onClick={() => setSelectedFacility(facility)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20
                        hover:bg-white"
                    >
                      <Maximize2 className="w-4 h-4 text-[#161A38]" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#0713FB]/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#0713FB]" />
                      </div>
                      <h3 className="font-playfair text-xl font-bold text-[#161A38]">
                        {facility.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {facility.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {facility.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-1 h-1 bg-[#0EF117] rounded-full" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className="text-[#0713FB] text-sm font-medium flex items-center gap-1 
                      hover:gap-2 transition-all group/btn">
                      <span>Take a virtual tour</span>
                      <ChevronRight className="w-4 h-4 group/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Facility Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden">
            {/* Image */}
            <div className="relative h-64 md:h-96">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedFacility.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-2">
                  {selectedFacility.title}
                </h3>
                <p className="text-white/80">{selectedFacility.description}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg 
                  hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-[#161A38]" />
              </button>
            </div>

            {/* Features */}
            <div className="p-6">
              <h4 className="font-semibold text-[#161A38] mb-4">Features & Amenities</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedFacility.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-[#0EF117] rounded-full" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}