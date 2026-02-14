'use client'

import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/useMobile'
import { Target, Heart, Globe, Leaf } from 'lucide-react'

export default function MissionStatement() {
  const { isMobile } = useMobile()

  const pillars = [
    {
      icon: Target,
      title: "Academic Excellence",
      description: "Rigorous curriculum preparing students for top universities worldwide",
      color: "#0713FB"
    },
    {
      icon: Heart,
      title: "Holistic Development",
      description: "Nurturing character, creativity, and critical thinking",
      color: "#0EF117"
    },
    {
      icon: Globe,
      title: "Global Citizenship",
      description: "Fostering understanding across cultures and nations",
      color: "#0713FB"
    },
    {
      icon: Leaf,
      title: "Sustainable Future",
      description: "Instilling responsibility for our planet and community",
      color: "#0EF117"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container-fluid">
        {/* Mission Statement Overlay - UWCSEA Style */}
        <div className="relative mb-16 md:mb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={cn(
              "font-playfair font-bold text-[#161A38] mb-6 leading-tight",
              isMobile ? "text-3xl" : "text-4xl md:text-5xl"
            )}>
              Education as a Force for{" "}
              <span className="bg-gradient-to-r from-[#0713FB] to-[#0EF117] bg-clip-text text-transparent">
                Peace and a Sustainable Future
              </span>
            </h2>
            
            <p className={cn(
              "text-gray-600 max-w-3xl mx-auto",
              isMobile ? "text-base" : "text-lg md:text-xl"
            )}>
              At Progress Preparatory School, we believe education transcends academics. 
              We are committed to developing compassionate, principled individuals who 
              will make a positive difference in Zambia and the world.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#0713FB]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#0EF117]/5 rounded-full blur-3xl" />
        </div>

        {/* Mission Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl 
                  transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 
                    transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <Icon className="w-8 h-8" style={{ color: pillar.color }} />
                </div>

                <h3 className="font-playfair text-xl font-bold text-[#161A38] mb-3">
                  {pillar.title}
                </h3>

                <p className="text-gray-600 text-sm md:text-base">
                  {pillar.description}
                </p>

                {/* Hover Line */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transform scale-x-0 
                    group-hover:scale-x-100 transition-transform duration-300"
                  style={{ backgroundColor: pillar.color }}
                />
              </div>
            )
          })}
        </div>

        {/* Mission in Action */}
        <div className="mt-16 md:mt-24">
          <div className="bg-[#161A38] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-[#0713FB] rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#0EF117] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-6">
                Mission in Action
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Community Service",
                    description: "500+ hours volunteered annually",
                    icon: Heart
                  },
                  {
                    title: "Cultural Exchange",
                    description: "15+ nationalities learning together",
                    icon: Globe
                  },
                  {
                    title: "Sustainability",
                    description: "Zero-waste campus initiative",
                    icon: Leaf
                  }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <Icon className="w-6 h-6 text-[#0EF117]" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-white/70 text-sm">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}