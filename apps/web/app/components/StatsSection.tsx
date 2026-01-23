export default function StatsSection() {
  const stats = [
    {
      number: '98%',
      label: 'Pass Rate',
      description: 'Consistent excellence in national examinations'
    },
    {
      number: '5,000+',
      label: 'Students Enrolled',
      description: 'Active learners across Zambia'
    },
    {
      number: '50+',
      label: 'Qualified Teachers',
      description: 'Specialized in online education'
    },
    {
      number: '15',
      label: 'Years Experience',
      description: 'Pioneers in virtual learning'
    }
  ]

  return (
    <section className="w-full py-20 bg-[#161A38] text-white">
      <div className="container-mobile">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Excellence in Numbers
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Our track record speaks for itself - consistent performance and proven results
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300"
            >
              <div className="text-5xl md:text-6xl font-bold text-[#0713FB] mb-4">
                {stat.number}
              </div>
              <div className="text-2xl font-semibold mb-3">{stat.label}</div>
              <div className="text-blue-200">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex flex-wrap justify-center gap-8 text-sm text-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#0713FB] rounded-full"></div>
              <span>Ministry of Education Accredited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#0713FB] rounded-full"></div>
              <span>Certified Online Learning Provider</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#0713FB] rounded-full"></div>
              <span>ISO 9001 Quality Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}