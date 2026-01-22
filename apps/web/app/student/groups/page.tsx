'use client'

import { useState, useEffect } from 'react'
import { FaUsers, FaPlus, FaCalendar, FaComment, FaVideo, FaSearch } from 'react-icons/fa'

interface StudyGroup {
  id: string
  name: string
  description: string
  class: string
  memberCount: number
  maxMembers: number
  nextMeeting: string
  isMember: boolean
  isPublic: boolean
  createdBy: string
}

interface GroupMeeting {
  id: string
  groupId: string
  title: string
  scheduledAt: string
  duration: number
  meetingUrl?: string
  description?: string
}

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [meetings, setMeetings] = useState<GroupMeeting[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchGroupsData = async () => {
      try {
        const [groupsResponse, meetingsResponse] = await Promise.all([
          fetch('/api/student/study-groups'),
          fetch('/api/student/group-meetings')
        ])
        
        const groupsData = await groupsResponse.json()
        const meetingsData = await meetingsResponse.json()
        
        setGroups(groupsData)
        setMeetings(meetingsData)
      } catch (error) {
        console.error('Error fetching groups data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroupsData()
  }, [])

  const myGroups = groups.filter(group => group.isMember)
  const availableGroups = groups.filter(group => !group.isMember)
  const filteredGroups = availableGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0713FB]"></div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>
          <p className="text-gray-600 mt-1">Collaborate and learn together with classmates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-[#0713FB] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#060EDB] transition-colors flex items-center space-x-2"
        >
          <FaPlus className="text-sm" />
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - My Groups & Upcoming Meetings */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Groups */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Study Groups</h2>
              <span className="text-sm text-gray-600">{myGroups.length} groups</span>
            </div>

            {myGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaUsers className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>You haven&apos;t joined any study groups yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myGroups.map(group => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#0713FB] transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{group.class}</span>
                        <span>•</span>
                        <span>{group.memberCount}/{group.maxMembers} members</span>
                        {group.nextMeeting && (
                          <>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <FaCalendar className="text-xs" />
                              <span>Next: {new Date(group.nextMeeting).toLocaleDateString()}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-[#0713FB] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#060EDB] transition-colors">
                        Enter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Meetings */}
          {upcomingMeetings.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Meetings</h2>
              <div className="space-y-3">
                {upcomingMeetings.map(meeting => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <FaCalendar className="text-xs" />
                          <span>{new Date(meeting.scheduledAt).toLocaleString()}</span>
                        </span>
                        <span>•</span>
                        <span>{meeting.duration} minutes</span>
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                      )}
                    </div>
                    {meeting.meetingUrl && (
                      <button className="bg-[#0EF117] text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#0CD714] transition-colors flex items-center space-x-2">
                        <FaVideo className="text-xs" />
                        <span>Join</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Available Groups */}
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Groups</h2>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No groups found</p>
                </div>
              ) : (
                filteredGroups.map(group => (
                  <div
                    key={group.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-[#0713FB] transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                      <span>{group.class}</span>
                      <span>{group.memberCount}/{group.maxMembers}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{group.description}</p>
                    <button className="w-full mt-3 bg-[#0713FB] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#060EDB] transition-colors">
                      Join Group
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-3">Group Features</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FaComment className="text-white opacity-90" />
                <span>Real-time chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaVideo className="text-white opacity-90" />
                <span>Virtual meetings</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="text-white opacity-90" />
                <span>Collaborative documents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  )
}

// Simple CreateGroupModal local to this file so `showCreateModal` has an effect
function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">Create Study Group</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" className="w-full px-4 py-2 border rounded-lg" />
          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="flex-1 bg-[#0713FB] text-white py-2 rounded-xl">
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border py-2 rounded-xl">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// (modal rendered from main component)