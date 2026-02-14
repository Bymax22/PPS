'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useMobile } from '@/hooks/useMobile'
import { BookOpen, Users, Calendar, Award, ChevronRight, Check } from 'lucide-react'

interface CurriculumLevel {
  level: string
  age: string
  description: string
  subjects: string[]
}

interface CurriculumShowcaseProps {
  levels?: CurriculumLevel[]
}

export default function CurriculumShowcase({ 
  levels = [
    {
      level: "Baby Class - Grade 2",
      age: "Ages 3-7",
      description: "Foundation years with play-based learning",
      subjects: ["Literacy", "Numeracy", "Creative Arts", "Physical Education"]
    },
    {
      level: "Grade 3 - 7",
      age: "Ages 8-12",
      description: "Building core competencies and critical thinking",
      subjects: ["English", "Mathematics", "Science", "Social Studies", "ICT"]
    },
    {
      level: "Grade 8 - 9",
      age: "Ages 13-15",
      description: "Junior Secondary - Cambridge Checkpoint",
      subjects: ["Mathematics", "English", "Sciences", "Humanities", "Creative Arts"]
    },
    {
      level: "Grade 10 - 12",
      age: "Ages 16-18",
      description: "IGCSE & Senior Secondary",
      subjects: ["Core Subjects", "Electives", "Life Skills", "Career Guidance"]
    }
  ]
}: CurriculumShowcaseProps) {
  const { isMobile } = useMobile()
  const [activeLevel, setActiveLevel] = useState(0)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-fluid">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className={cn(
            "font-playfair font-bold text-[#161A38] mb-4",
            isMobile ? "text-3xl" : "text-4xl md:text-5xl"
          )}>
            K-12 Learning Journey
          </h2>
          <p className="text-gray-600 text-lg">
            A seamless academic progression from early years to university preparation, 
            aligned with both Zambian and Cambridge curricula
          </p>
        </div>

        {/* Curriculum Tabs - UWCSEA Style */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Level Navigation */}
          <div className="lg:col-span-1">
            <div className={cn(
              "flex lg:flex-col gap-3",
              isMobile ? "overflow-x-auto pb-4" : ""
            )}>
              {levels.map((level, index) => (
                <button
                  key={index}
                  onClick={() => setActiveLevel(index)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl text-left transition-all",
                    "hover:bg-[#0713FB]/5 group",
                    activeLevel === index 
                      ? "bg-[#0713FB] text-white shadow-lg" 
                      : "bg-gray-50 text-[#161A38]"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    activeLevel === index 
                      ? "bg-white/20" 
                      : "bg-[#0713FB] group-hover:bg-[#0713FB]"
                  )}>
                    <BookOpen className={cn(
                      "w-5 h-5",
                      activeLevel === index ? "text-white" : "text-white"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className={cn(
                      "font-semibold",
                      activeLevel === index ? "text-white" : "text-[#161A38]"
                    )}>
                      {level.level}
                    </div>
                    <div className={cn(
                      "text-sm",
                      activeLevel === index ? "text-white/80" : "text-gray-500"
                    )}>
                      {level.age}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Level Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-[#161A38] mb-2">
                    {levels[activeLevel].level}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{levels[activeLevel].age}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Full-time program</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0713FB]/10 px-4 py-2 rounded-lg">
                  <span className="text-[#0713FB] font-semibold">Both Curricula</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8">
                {levels[activeLevel].description}
              </p>

              {/* Subjects Grid */}
              <div className="mb-8">
                <h4 className="font-semibold text-[#161A38] mb-4">Core Subjects</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {levels[activeLevel].subjects.map((subject, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Check className="w-4 h-4 text-[#0EF117]" />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Goals */}
              <div className="bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <Award className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Learning Goals</h4>
                    <p className="text-white/90 text-sm">
                      Students develop conceptual understanding necessary for the next academic 
                      challenge, building towards peace and a sustainable future.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="mt-6 w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <span className="font-medium text-[#161A38]">View detailed curriculum</span>
                <ChevronRight className="w-5 h-5 text-[#0713FB] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Dual Curriculum Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0713FB]/10 px-6 py-3 rounded-full">
            <BookOpen className="w-5 h-5 text-[#0713FB]" />
            <span className="text-[#161A38] font-medium">
              We offer both Zambian and Cambridge curricula across all grade levels
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}