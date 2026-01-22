'use client'

import { useState, useRef } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaClock, FaUserGraduate, FaBookOpen, FaCheckCircle, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa'

const freeLessons = [
  {
    id: 1,
    title: 'Introduction to Algebra',
    description: 'Learn the basics of algebraic expressions, equations, and solving for variables.',
    teacher: 'Prof. David Phiri',
    duration: '24:30',
    views: '45K',
    subject: 'Mathematics',
    grade: 'Grade 8-10',
    videoUrl: '/5535970-uhd_3840_2160_25fps.mp4',
    thumbnail: '/math-lesson.jpg',
    topics: ['Variables', 'Expressions', 'Equations', 'Linear Functions']
  },
  {
    id: 2,
    title: 'Physics: Motion & Forces',
    description: 'Understand Newton\'s laws of motion and how forces affect objects in motion.',
    teacher: 'Dr. Sarah Banda',
    duration: '32:15',
    views: '38K',
    subject: 'Physics',
    grade: 'Grade 9-11',
    videoUrl: '/5904542-uhd_3840_2160_24fps.mp4',
    thumbnail: '/physics-lesson.jpg',
    topics: ['Newton\'s Laws', 'Velocity', 'Acceleration', 'Forces']
  },
  {
    id: 3,
    title: 'English Grammar Basics',
    description: 'Master parts of speech, sentence structure, and punctuation rules.',
    teacher: 'Ms. Lisa Ndhlovu',
    duration: '28:40',
    views: '52K',
    subject: 'English',
    grade: 'All Grades',
    videoUrl: '/7092223-hd_1920_1080_30fps.mp4',
    thumbnail: '/english-lesson.jpg',
    topics: ['Nouns & Verbs', 'Sentence Types', 'Punctuation', 'Tenses']
  },
  {
    id: 4,
    title: 'Chemistry: Elements & Compounds',
    description: 'Explore the periodic table and learn about chemical bonding and reactions.',
    teacher: 'Prof. James Mulenga',
    duration: '35:20',
    views: '41K',
    subject: 'Chemistry',
    grade: 'Grade 10-12',
    videoUrl: '/my-video.m4v',
    thumbnail: '/chemistry-lesson.jpg',
    topics: ['Periodic Table', 'Atoms', 'Bonding', 'Reactions']
  }
]

export default function FreeLessons() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({})

  const currentLesson = freeLessons[activeVideo]

  // Video controls
  const togglePlayPause = () => {
    const video = videoRefs.current[currentLesson.id]
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    const video = videoRefs.current[currentLesson.id]
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const selectVideo = (index: number) => {
    // Pause current video before switching
    const currentVideo = videoRefs.current[freeLessons[activeVideo].id]
    if (currentVideo) {
      currentVideo.pause()
    }

    // Switch to new video
    setActiveVideo(index)
    setIsPlaying(true)
    
    // Play new video
    setTimeout(() => {
      const nextVideo = videoRefs.current[freeLessons[index].id]
      if (nextVideo) {
        nextVideo.play().catch(e => console.log("Auto-play prevented:", e))
      }
    }, 0)
  }

  const handleVideoEnded = () => {
    // Auto-play next video
    const nextIndex = (activeVideo + 1) % freeLessons.length
    selectVideo(nextIndex)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 mb-4">
            <FaCheckCircle className="text-[#0EF117] text-sm" />
            <span className="text-sm font-semibold text-gray-700">100% Free Access</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Free Learning <span className="text-[#0713FB]">Resources</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch high-quality educational videos without any login or subscription required.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
              {/* Video Container */}
              <div 
                className="relative aspect-video bg-black"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                <video
                  ref={(el) => {
                    if (el) {
                      videoRefs.current[currentLesson.id] = el
                    }
                  }}
                  key={currentLesson.id}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={isMuted}
                  onEnded={handleVideoEnded}
                  playsInline
                  preload="metadata"
                >
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                  <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                    default
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Video Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  showControls ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent' : ''
                }`}>
                  {/* Video Info */}
                  <div className={`absolute top-4 left-4 right-4 transition-transform duration-300 ${
                    showControls ? 'translate-y-0' : '-translate-y-4'
                  }`}>
                    <div className="backdrop-blur-md bg-black/40 rounded-lg p-4 max-w-xl">
                      <h3 className="text-xl font-bold text-white mb-2">{currentLesson.title}</h3>
                      <div className="flex items-center space-x-4 text-white/80 text-sm">
                        <span className="flex items-center space-x-1">
                          <FaUserGraduate className="text-xs" />
                          <span>{currentLesson.teacher}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FaClock className="text-xs" />
                          <span>{currentLesson.duration}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ${
                    showControls ? 'translate-y-0' : 'translate-y-full'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={togglePlayPause}
                          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                        >
                          {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                        </button>

                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                        >
                          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>

                        <div className="text-white font-medium">
                          {currentLesson.duration}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1.5 bg-[#0713FB] text-white text-sm font-medium rounded-full">
                          {currentLesson.subject}
                        </span>
                        <span className="px-3 py-1.5 bg-[#0EF117] text-gray-900 text-sm font-medium rounded-full">
                          {currentLesson.grade}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Play/Pause overlay */}
                  {!showControls && (
                    <button
                      onClick={togglePlayPause}
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                    >
                      <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        {isPlaying ? (
                          <FaPause className="text-white text-2xl" />
                        ) : (
                          <FaPlay className="text-white text-2xl ml-2" />
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson Details */}
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{currentLesson.title}</h3>
                <p className="text-gray-600 mb-6">{currentLesson.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentLesson.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-gray-600 text-sm">
                    <span className="font-medium">{currentLesson.views} students watched</span>
                  </div>
                  <button className="flex items-center space-x-2 text-[#0713FB] font-semibold hover:text-blue-700 transition-colors">
                    <span>More from {currentLesson.teacher}</span>
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FaBookOpen className="text-[#0713FB] mr-2" />
                Free Lesson Library
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Select any lesson below to start learning immediately. No account needed!
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FaCheckCircle className="text-[#0EF117]" />
                  <span>100% Free Access</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FaCheckCircle className="text-[#0EF117]" />
                  <span>No Registration Required</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FaCheckCircle className="text-[#0EF117]" />
                  <span>Watch Anytime</span>
                </div>
              </div>
            </div>

            {/* Lesson Thumbnails */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Available Lessons</h4>
              {freeLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  onClick={() => selectVideo(index)}
                  className={`group bg-white rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
                    activeVideo === index
                      ? 'border-[#0713FB] shadow-md bg-blue-50/50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${lesson.thumbnail})` }}
                      >
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            {activeVideo === index && isPlaying ? (
                              <FaPause className="text-gray-900 text-xs" />
                            ) : (
                              <FaPlay className="text-gray-900 text-xs ml-0.5" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {lesson.duration}
                      </div>
                      {activeVideo === index && (
                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#0EF117] animate-pulse"></div>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h5 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-[#0713FB] transition-colors">
                          {lesson.title}
                        </h5>
                        {activeVideo === index && (
                          <div className="w-2 h-2 rounded-full bg-[#0713FB]"></div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {lesson.teacher} • {lesson.subject}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {lesson.views} views
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          lesson.subject === 'Mathematics' ? 'bg-blue-50 text-[#0713FB]' :
                          lesson.subject === 'Physics' ? 'bg-purple-50 text-purple-600' :
                          lesson.subject === 'English' ? 'bg-green-50 text-[#0EF117]' :
                          'bg-yellow-50 text-yellow-600'
                        }`}>
                          {lesson.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#0713FB] to-blue-600 rounded-xl p-5 text-white">
              <h4 className="font-bold text-lg mb-3">Want More Content?</h4>
              <p className="text-white/90 text-sm mb-4">
                Create a free account to access personalized learning paths, track progress, and save your favorite lessons.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white text-gray-900 font-semibold py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                  Create Free Account
                </button>
                <button className="w-full bg-transparent border border-white text-white font-semibold py-2.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center space-x-2">
                  <span>Browse All Free Lessons</span>
                  <FaExternalLinkAlt className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-[#0713FB] rounded-lg flex items-center justify-center text-white text-lg mx-auto mb-4">
              <FaPlay />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Instant Access</h4>
            <p className="text-gray-600 text-sm">Start learning immediately without any registration or login</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-[#0EF117] rounded-lg flex items-center justify-center text-white text-lg mx-auto mb-4">
              <FaUserGraduate />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Expert Teachers</h4>
            <p className="text-gray-600 text-sm">Learn from experienced educators with proven teaching methods</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-[#0713FB] rounded-lg flex items-center justify-center text-white text-lg mx-auto mb-4">
              <FaClock />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Self-Paced Learning</h4>
            <p className="text-gray-600 text-sm">Watch lessons anytime, pause and resume at your convenience</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        video {
          -webkit-transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          -webkit-perspective: 1000;
        }
        
        /* Hide native controls for better custom experience */
        video::-webkit-media-controls {
          display: none !important;
        }
        
        video::-webkit-media-controls-enclosure {
          display: none !important;
        }
        
        video::-webkit-media-controls-panel {
          display: none !important;
        }
        
        video::-webkit-media-controls-play-button {
          display: none !important;
        }
        
        video::-webkit-media-controls-timeline {
          display: none !important;
        }
        
        video::-webkit-media-controls-current-time-display {
          display: none !important;
        }
        
        video::-webkit-media-controls-time-remaining-display {
          display: none !important;
        }
        
        video::-webkit-media-controls-timeline-container {
          display: none !important;
        }
        
        video::-webkit-media-controls-volume-slider-container {
          display: none !important;
        }
        
        video::-webkit-media-controls-volume-slider {
          display: none !important;
        }
        
        video::-webkit-media-controls-mute-button {
          display: none !important;
        }
        
        video::-webkit-media-controls-toggle-closed-captions-button {
          display: none !important;
        }
        
        video::-webkit-media-controls-fullscreen-button {
          display: none !important;
        }
      `}</style>
    </section>
  )
}