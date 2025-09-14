import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { FaVideo, FaTasks, FaUsers, FaChartLine, FaArrowLeft, FaChalkboardTeacher, FaGraduationCap, FaBullhorn, FaPaperPlane, FaTrash } from 'react-icons/fa'

const ClassroomDetail = () => {
  const { classroomId } = useParams()
  const navigate = useNavigate()
  const { userData, backendUrl } = useContext(AppContent)
  const [activeSection, setActiveSection] = useState('stream')
  const [classroomDetails, setClassroomDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState([])
  const [announcementLoading, setAnnouncementLoading] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' })
  const [postingAnnouncement, setPostingAnnouncement] = useState(false)
  const [isAnnouncementFormExpanded, setIsAnnouncementFormExpanded] = useState(false)

  const sections = [
    { id: 'stream', label: 'Stream', icon: FaVideo, color: 'blue' },
    { id: 'classworks', label: 'Classworks', icon: FaTasks, color: 'green' },
    { id: 'people', label: 'People', icon: FaUsers, color: 'purple' },
    { id: 'marks', label: 'Marks', icon: FaChartLine, color: 'orange' }
  ]

  // Fetch classroom details
  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${backendUrl}/api/classrooms/${classroomId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()
        console.log('Classroom details response:', data)
        
        if (data.success) {
          setClassroomDetails(data.classroom)
        } else {
          console.error('Failed to fetch classroom details:', data.message)
        }
      } catch (error) {
        console.error('Error fetching classroom details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (classroomId && userData) {
      fetchClassroomDetails()
    }
  }, [classroomId, userData, backendUrl])

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      setAnnouncementLoading(true)
      const response = await fetch(`${backendUrl}/api/announcements/classroom/${classroomId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Announcements response:', data)
      
      if (data.success) {
        setAnnouncements(data.announcements)
      } else {
        console.error('Failed to fetch announcements:', data.message)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setAnnouncementLoading(false)
    }
  }

  // Post new announcement
  const handlePostAnnouncement = async (e) => {
    e.preventDefault()
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      return
    }

    try {
      setPostingAnnouncement(true)
      const response = await fetch(`${backendUrl}/api/announcements`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          classroomId,
          title: newAnnouncement.title,
          content: newAnnouncement.content
        })
      })
      
      const data = await response.json()
      console.log('Post announcement response:', data)
      
      if (data.success) {
        setNewAnnouncement({ title: '', content: '' })
        setIsAnnouncementFormExpanded(false) // Collapse form after posting
        fetchAnnouncements() // Refresh announcements
      } else {
        console.error('Failed to post announcement:', data.message)
      }
    } catch (error) {
      console.error('Error posting announcement:', error)
    } finally {
      setPostingAnnouncement(false)
    }
  }

  // Delete announcement
  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      const response = await fetch(`${backendUrl}/api/announcements/${announcementId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchAnnouncements() // Refresh announcements
      } else {
        console.error('Failed to delete announcement:', data.message)
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  // Fetch announcements when classroom details are loaded
  useEffect(() => {
    if (classroomDetails && classroomId) {
      fetchAnnouncements()
    }
  }, [classroomDetails, classroomId])

  const getSectionColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    }
    return colors[color] || 'from-gray-500 to-gray-600'
  }

  const getSectionHoverColor = (color) => {
    const colors = {
      blue: 'hover:from-blue-600 hover:to-blue-700',
      green: 'hover:from-green-600 hover:to-green-700',
      purple: 'hover:from-purple-600 hover:to-purple-700',
      orange: 'hover:from-orange-600 hover:to-orange-700'
    }
    return colors[color] || 'hover:from-gray-600 hover:to-gray-700'
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'stream':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Class Stream</h3>
            
            {/* Announcement Form - Only for teachers */}
            {classroomDetails && classroomDetails.isTeacher && (
              <div className="bg-white rounded-lg shadow-sm border">
                {!isAnnouncementFormExpanded ? (
                  /* Collapsed State */
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setIsAnnouncementFormExpanded(true)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaBullhorn className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-500 text-sm">Announce something to your class</p>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Expanded State */
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaBullhorn className="text-blue-500" />
                      <h4 className="text-lg font-medium text-gray-800">Post Announcement</h4>
                    </div>
                    <form onSubmit={handlePostAnnouncement} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter announcement title"
                          required
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          placeholder="Enter your announcement message"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAnnouncementFormExpanded(false)
                            setNewAnnouncement({ title: '', content: '' })
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={postingAnnouncement || !newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaPaperPlane className="text-sm" />
                          {postingAnnouncement ? 'Posting...' : 'Post Announcement'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Announcements List */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaVideo className="text-blue-500" />
                <h4 className="text-lg font-medium text-gray-800">Announcements</h4>
              </div>
              
              {announcementLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Loading announcements...</p>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBullhorn className="text-2xl text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No announcements yet</h4>
                  <p className="text-gray-500">
                    {classroomDetails && classroomDetails.isTeacher 
                      ? "Post your first announcement to communicate with students."
                      : "Announcements from your teacher will appear here."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaBullhorn className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800">{announcement.title}</h5>
                            <p className="text-sm text-gray-500">
                              by {announcement.author.name} • {new Date(announcement.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Delete button - only for announcement author */}
                        {classroomDetails && classroomDetails.isTeacher && (
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete announcement"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {announcement.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      case 'classworks':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Classworks</h3>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTasks className="text-2xl text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">No assignments yet</h4>
                <p className="text-gray-500">Assignments, quizzes, and class activities will appear here.</p>
              </div>
            </div>
          </div>
        )
      case 'people':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">People</h3>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-2xl text-gray-400 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">Loading members...</h4>
                </div>
              ) : classroomDetails && classroomDetails.members ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      {classroomDetails.members.filter(member => member.role === 'student').length} student{classroomDetails.members.filter(member => member.role === 'student').length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {classroomDetails.members.map((member) => (
                      <div
                        key={member._id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          member.isCurrentUser 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            member.role === 'teacher' 
                              ? 'bg-purple-100 text-purple-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {member.role === 'teacher' ? (
                              <FaChalkboardTeacher className="text-lg" />
                            ) : (
                              <FaGraduationCap className="text-lg" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-800">{member.name}</h4>
                              {member.isCurrentUser && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.role === 'teacher'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {member.role === 'teacher' ? 'Teacher' : 'Student'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-2xl text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No members found</h4>
                  <p className="text-gray-500">Unable to load classroom members.</p>
                </div>
              )}
            </div>
          </div>
        )
      case 'marks':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Marks</h3>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartLine className="text-2xl text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">No grades yet</h4>
                <p className="text-gray-500">Grades and performance analytics will appear here when assignments are graded.</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (!userData) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/classrooms')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span>Back to Classrooms</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-800">
              {classroomDetails ? classroomDetails.name : `Classroom ${classroomId}`}
            </h1>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${getSectionColor(section.color)} text-white shadow-lg`
                    : `text-gray-600 hover:bg-white hover:text-gray-800 ${getSectionHoverColor(section.color)}`
                }`}
              >
                <section.icon className="text-lg" />
                <span className="text-sm">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        <div className="bg-gray-50 rounded-lg p-6 min-h-96">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  )
}

export default ClassroomDetail
