import Link from 'next/link'

const news = [
  {
    id: 1,
    title: 'Progress Preparatory Ranked #1 Virtual School in Zambia',
    excerpt: 'Our institution has been recognized as the leading online learning platform for academic excellence and innovation.',
    date: 'March 15, 2024',
    category: 'Achievement',
    image: '/images/news-achievement.jpg',
    readTime: '3 min read'
  },
  {
    id: 2,
    title: 'New AI-Powered Learning Features Launched',
    excerpt: 'Introducing adaptive learning paths and intelligent tutoring systems to personalize education for every student.',
    date: 'March 10, 2024',
    category: 'Innovation',
    image: '/images/news-innovation.jpg',
    readTime: '4 min read'
  },
  {
    id: 3,
    title: 'Grade 12 Students Achieve Record-Breaking Results',
    excerpt: 'Our 2023 graduating class achieves 100% pass rate with 65% earning distinctions in core subjects.',
    date: 'March 5, 2024',
    category: 'Results',
    image: '/images/news-results.jpg',
    readTime: '5 min read'
  },
  {
    id: 4,
    title: 'Partnership with Zambia Ministry of Education',
    excerpt: 'Collaborating to enhance digital learning infrastructure and teacher training programs nationwide.',
    date: 'February 28, 2024',
    category: 'Partnership',
    image: '/images/news-partnership.jpg',
    readTime: '4 min read'
  }
]

const events = [
  {
    id: 1,
    title: 'Virtual Open House',
    date: 'April 15, 2024',
    time: '10:00 AM CAT',
    type: 'Online Event',
    description: 'Experience our platform and meet our teachers'
  },
  {
    id: 2,
    title: 'Parent-Teacher Conferences',
    date: 'April 20-22, 2024',
    time: 'Various Times',
    type: 'Virtual Meetings',
    description: 'Discuss student progress with teachers'
  },
  {
    id: 3,
    title: 'STEM Innovation Challenge',
    date: 'May 5, 2024',
    time: '9:00 AM CAT',
    type: 'Competition',
    description: 'Annual science and technology competition'
  }
]

export default function NewsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-mobile">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#0713FB] bg-opacity-10 text-[#0713FB] rounded-full text-sm font-semibold mb-4">
            News & Events
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#161A38] mb-6">
            Latest Updates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about our achievements, innovations, and upcoming events in the world of virtual education.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* News Articles */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#161A38]">Latest News</h3>
              <Link href="/news" className="text-[#0713FB] font-semibold hover:underline">
                View All News →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {news.map((article) => (
                <article key={article.id} className="group">
                  <div className="bg-gray-200 rounded-2xl h-48 mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[#0713FB] to-[#161A38] flex items-center justify-center text-white text-2xl font-bold">
                      {article.category}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="px-3 py-1 bg-[#0713FB] bg-opacity-10 text-[#0713FB] rounded-full font-semibold">
                        {article.category}
                      </span>
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h4 className="text-xl font-bold text-[#161A38] group-hover:text-[#0713FB] transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <Link 
                      href={`/news/${article.id}`}
                      className="inline-flex items-center text-[#0713FB] font-semibold hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#0713FB] to-[#161A38] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Upcoming Events</h3>
              
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white bg-opacity-10 rounded-xl p-4 border border-white border-opacity-20">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <span className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs font-semibold">
                        {event.type}
                      </span>
                    </div>
                    <div className="text-blue-100 text-sm mb-2">
                      {event.date} • {event.time}
                    </div>
                    <p className="text-blue-100 text-sm">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-xl border border-white border-opacity-20">
                <h4 className="font-semibold mb-2">Enrollment Period</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Limited spots available for 2024 academic year. Secure your child&apos;s place today.
                </p>
                <Link
                  href="/enroll"
                  className="block w-full bg-white text-[#161A38] text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  Apply Now
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-[#161A38] mb-4">Quick Links</h4>
              <div className="space-y-3">
                <Link href="/downloads" className="flex items-center text-gray-600 hover:text-[#0713FB] transition-colors">
                  📥 Download Brochure
                </Link>
                <Link href="/fees" className="flex items-center text-gray-600 hover:text-[#0713FB] transition-colors">
                  💰 Fee Structure
                </Link>
                <Link href="/calendar" className="flex items-center text-gray-600 hover:text-[#0713FB] transition-colors">
                  📅 Academic Calendar
                </Link>
                <Link href="/contact" className="flex items-center text-gray-600 hover:text-[#0713FB] transition-colors">
                  📞 Contact Admissions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}