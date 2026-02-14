'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Laptop, Users, Calendar, FileText, CheckCircle, AlertCircle, Upload, CreditCard, User, Mail, Phone, MapPin, BookOpen, GraduationCap, Globe, Award } from 'lucide-react'
import { useState } from 'react'

export default function ApplicationFormPage() {
  const router = useRouter()
  const [programType, setProgramType] = useState<'campus' | 'home' | 'online' | null>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Student Information
    studentFirstName: '',
    studentLastName: '',
    studentDob: '',
    studentGender: '',
    studentNationality: 'Zambian',
    studentGrade: '',
    
    // Parent/Guardian Information
    parentFirstName: '',
    parentLastName: '',
    parentRelationship: '',
    parentEmail: '',
    parentPhone: '',
    parentOccupation: '',
    
    // Address Information
    address: '',
    city: 'Lusaka',
    province: 'Lusaka',
    
    // Previous School
    previousSchool: '',
    previousGrade: '',
    schoolReport: null as File | null,
    
    // Program Specific
    preferredStartDate: '',
    preferredSchedule: '',
    specialNeeds: '',
    howHeard: '',
    
    // Documents
    birthCertificate: null as File | null,
    passportPhoto: null as File | null,
    immunizations: null as File | null,
    
    // Agreement
    agreeTerms: false,
    agreePhotos: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }))
    }
  }

  const handleProgramSelect = (type: 'campus' | 'home' | 'online') => {
    setProgramType(type)
    if (type === 'online') {
      // Redirect to portal account creation for online learning
      router.push('/portal/student/register?program=online')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission for campus and home programs
    console.log('Form submitted:', formData)
    // In production, send to API endpoint
    router.push('/application-success')
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  // If online program is selected, show redirect message
  if (programType === 'online') {
    return (
      <main className="pt-32 pb-20 min-h-screen bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Programs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white text-center"
          >
            <Laptop className="w-16 h-16 text-[var(--campus-gold)] mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Online Learning Application
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              You're being redirected to create your online learning account
            </p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-300">Redirecting...</p>
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Programs
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
            Begin Your Journey
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Application Form
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to apply for {programType === 'campus' ? 'On-Campus' : 'Home One-on-One'} learning
          </p>
        </motion.div>

        {/* Program Selection if not selected */}
        {!programType ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <button
              onClick={() => handleProgramSelect('campus')}
              className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-[var(--campus-gold)] hover:shadow-xl transition-all group"
            >
              <Home className="w-12 h-12 text-[#003087] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">On-Campus</h3>
              <p className="text-sm text-gray-500">Learn at our facilities with full access to resources</p>
            </button>

            <button
              onClick={() => handleProgramSelect('home')}
              className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-[var(--campus-gold)] hover:shadow-xl transition-all group"
            >
              <Home className="w-12 h-12 text-[#003087] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Home One-on-One</h3>
              <p className="text-sm text-gray-500">Personalized tutoring at your home</p>
            </button>

            <button
              onClick={() => handleProgramSelect('online')}
              className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-[var(--campus-gold)] hover:shadow-xl transition-all group"
            >
              <Laptop className="w-12 h-12 text-[#003087] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Online Sessions</h3>
              <p className="text-sm text-gray-500">Virtual learning from anywhere (redirects to portal)</p>
            </button>
          </motion.div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${s === step ? 'bg-[var(--campus-gold)] text-gray-900' : 
                      s < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Student Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-[#003087] mb-6">Student Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="studentFirstName"
                        value={formData.studentFirstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="studentLastName"
                        value={formData.studentLastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="Enter last name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="studentDob"
                        value={formData.studentDob}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="studentGender"
                        value={formData.studentGender}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality
                      </label>
                      <input
                        type="text"
                        name="studentNationality"
                        value={formData.studentNationality}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Applying for Grade <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="studentGrade"
                        value={formData.studentGrade}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      >
                        <option value="">Select grade</option>
                        <option value="Baby Class">Baby Class</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Reception">Reception</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Parent/Guardian Information */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-[#003087] mb-6">Parent/Guardian Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentFirstName"
                        value={formData.parentFirstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentLastName"
                        value={formData.parentLastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="Enter last name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship to Student <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="parentRelationship"
                        value={formData.parentRelationship}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      >
                        <option value="">Select relationship</option>
                        <option value="mother">Mother</option>
                        <option value="father">Father</option>
                        <option value="guardian">Legal Guardian</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="07XXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="parentOccupation"
                        value={formData.parentOccupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Address & Previous School */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-[#003087] mb-6">Address & Previous School</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Residential Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="Enter your full address"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Province <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Previous School (if any)
                        </label>
                        <input
                          type="text"
                          name="previousSchool"
                          value={formData.previousSchool}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                          placeholder="Name of previous school"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Grade Completed
                        </label>
                        <input
                          type="text"
                          name="previousGrade"
                          value={formData.previousGrade}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                          placeholder="e.g., Grade 3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload School Report (if available)
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[var(--campus-gold)] transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'schoolReport')}
                          className="hidden"
                          id="schoolReport"
                        />
                        <label htmlFor="schoolReport" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-400 block mt-1">
                            PDF, PNG, JPG up to 5MB
                          </span>
                        </label>
                      </div>
                      {formData.schoolReport && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {formData.schoolReport.name} uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Additional Information & Documents */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-[#003087] mb-6">Additional Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Start Date
                      </label>
                      <input
                        type="date"
                        name="preferredStartDate"
                        value={formData.preferredStartDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Schedule (if applicable)
                      </label>
                      <select
                        name="preferredSchedule"
                        value={formData.preferredSchedule}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      >
                        <option value="">Select schedule</option>
                        <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                        <option value="afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                        <option value="full">Full Day (8:00 AM - 3:00 PM)</option>
                        <option value="flexible">Flexible (to be discussed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Needs or Medical Conditions
                      </label>
                      <textarea
                        name="specialNeeds"
                        value={formData.specialNeeds}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                        placeholder="Please list any medical conditions, allergies, or special requirements"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How did you hear about us?
                      </label>
                      <select
                        name="howHeard"
                        value={formData.howHeard}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                      >
                        <option value="">Select option</option>
                        <option value="friend">Friend/Family</option>
                        <option value="social">Social Media</option>
                        <option value="website">Website</option>
                        <option value="search">Search Engine</option>
                        <option value="ad">Advertisement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-[#003087] mb-4">Required Documents</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Birth Certificate <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'birthCertificate')}
                            required
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recent Passport Photo <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'passportPhoto')}
                            required
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Immunization Records
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'immunizations')}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                          required
                          className="mt-1"
                        />
                        <span className="text-sm text-gray-600">
                          I confirm that the information provided is accurate and complete. I understand that 
                          submitting this application does not guarantee admission. <span className="text-red-500">*</span>
                        </span>
                      </label>

                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="agreePhotos"
                          checked={formData.agreePhotos}
                          onChange={(e) => setFormData(prev => ({ ...prev, agreePhotos: e.target.checked }))}
                          className="mt-1"
                        />
                        <span className="text-sm text-gray-600">
                          I consent to the use of photographs/videos of my child for school publications and marketing materials.
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 border-2 border-[#003087] text-[#003087] rounded-xl font-semibold hover:bg-[#003087] hover:text-white transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          </>
        )}

        {/* Application Fee Notice */}
        {programType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">Application Fee: ZMW 200 (non-refundable)</p>
              <p>You will be redirected to make payment after submitting this form. The application fee must be paid before your application is processed.</p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}