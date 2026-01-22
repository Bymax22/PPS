'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaSearch, FaPaperclip, FaPaperPlane, FaEnvelope, FaUser, FaClock } from 'react-icons/fa'

interface Message {
  id: string
  teacherName: string
  teacherAvatar?: string
  subject: string
  message: string
  timestamp: string
  isRead: boolean
  attachments?: string[]
  priority: 'high' | 'medium' | 'low'
}

interface Teacher {
  id: string
  name: string
  avatar?: string
  subject: string
  email: string
  phone?: string
  officeHours?: string
}

export default function CommunicationsPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox')

  useEffect(() => {
    const fetchCommunicationsData = async () => {
      try {
        const [messagesResponse, teachersResponse] = await Promise.all([
          fetch('/api/parent/messages'),
          fetch('/api/parent/teachers')
        ])
        
        const messagesData = await messagesResponse.json()
        const teachersData = await teachersResponse.json()
        
        setMessages(messagesData)
        setTeachers(teachersData)
      } catch (error) {
        console.error('Error fetching communications data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunicationsData()
  }, [])

  const unreadMessages = messages.filter(msg => !msg.isRead)
  const filteredMessages = selectedTeacher 
    ? messages.filter(msg => msg.teacherName === selectedTeacher)
    : messages

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedTeacher) return

    // Simulate sending message
    const message: Message = {
      id: Date.now().toString(),
      teacherName: selectedTeacher,
      subject: 'New Message',
      message: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
      priority: 'medium'
    }

    setMessages(prev => [message, ...prev])
    setNewMessage('')
    setActiveTab('inbox')
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Communications</h1>
          <p className="text-gray-600 mt-1">Stay connected with your child&apos;s teachers</p>
        </div>
        <button
          onClick={() => setActiveTab('compose')}
          className="mt-4 sm:mt-0 bg-[#0713FB] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#060EDB] transition-colors"
        >
          New Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Teachers List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Teachers List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Teachers</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedTeacher(null)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedTeacher === null 
                    ? 'bg-[#0713FB] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Teachers
              </button>
              {teachers.map(teacher => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher.name)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedTeacher === teacher.name 
                      ? 'bg-[#0713FB] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {teacher.avatar ? (
                        <Image src={teacher.avatar} alt={teacher.name} width={32} height={32} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-sm opacity-75">{teacher.subject}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              {teachers.slice(0, 3).map(teacher => (
                <div key={teacher.id} className="flex justify-between items-center">
                  <span>{teacher.name}</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                    {teacher.subject}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'inbox' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Inbox Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {unreadMessages.length} unread messages
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="p-6">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaEnvelope className="text-4xl mx-auto mb-2 text-gray-300" />
                    <p>No messages found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map(message => (
                      <div
                        key={message.id}
                        className={`border rounded-lg p-4 hover:border-[#0713FB] transition-colors ${
                          message.isRead ? 'border-gray-200' : 'border-[#0713FB] bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-full flex items-center justify-center text-white font-bold">
                              {message.teacherAvatar ? (
                                <Image src={message.teacherAvatar} alt={message.teacherName} width={40} height={40} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <FaUser />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{message.teacherName}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{message.subject}</span>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  <FaClock className="text-xs" />
                                  <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">{message.message}</p>

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <FaPaperclip className="text-xs" />
                            <span>{message.attachments.length} attachment(s)</span>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button className="text-[#0713FB] hover:text-[#060EDB] text-sm font-medium">
                            Reply
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                            Mark as {message.isRead ? 'Unread' : 'Read'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Compose Message */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Message</h2>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                {/* Recipient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <select
                    value={selectedTeacher || ''}
                    onChange={(e) => setSelectedTeacher(e.target.value || null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
                    required
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.name}>
                        {teacher.name} - {teacher.subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={8}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('inbox')}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !selectedTeacher}
                    className="flex-1 bg-[#0713FB] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#060EDB] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <FaPaperPlane className="text-sm" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}