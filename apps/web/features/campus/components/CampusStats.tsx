export default function CampusStats() {
  const stats = [
    { label: "Students", value: "500+" },
    { label: "Nationalities", value: "15+" },
    { label: "Teacher-Student Ratio", value: "1:12" },
    { label: "Years of Excellence", value: "15+" }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-fluid">
        <div className="grid md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-playfair font-bold text-[#161A38] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 uppercase tracking-wide text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
