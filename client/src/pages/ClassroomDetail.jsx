import React, { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { FaVideo, FaTasks, FaUsers, FaChartLine, FaArrowLeft } from 'react-icons/fa'

const ClassroomDetail = () => {
  const { classroomId } = useParams()
  const navigate = useNavigate()
  const { userData } = useContext(AppContent)
  const [activeSection, setActiveSection] = useState('stream')

  const sections = [
    { id: 'stream', label: 'Stream', icon: FaVideo, color: 'blue' },
    { id: 'classworks', label: 'Classworks', icon: FaTasks, color: 'green' },
    { id: 'people', label: 'People', icon: FaUsers, color: 'purple' },
    { id: 'marks', label: 'Marks', icon: FaChartLine, color: 'orange' }
  ]

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
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Class Stream</h3>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaVideo className="text-2xl text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">No posts yet</h4>
                <p className="text-gray-500">The class stream is empty. Posts and announcements will appear here.</p>
              </div>
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
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-2xl text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">No members yet</h4>
                <p className="text-gray-500">Classroom members will appear here when they join.</p>
              </div>
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
            <h1 className="text-2xl font-bold text-gray-800">Classroom {classroomId}</h1>
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
