import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FaTrash, FaEllipsisV } from 'react-icons/fa'

const ClassroomManager = () => {
  const navigate = useNavigate()
  const { backendUrl, userData } = useContext(AppContent)
  const [classrooms, setClassrooms] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [classroomToDelete, setClassroomToDelete] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  
  // Create classroom form state
  const [createForm, setCreateForm] = useState({
    name: '',
    description: ''
  })
  
  // Join classroom form state
  const [joinForm, setJoinForm] = useState({
    inviteCode: ''
  })

  // Fetch user's classrooms
  const fetchClassrooms = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/classrooms/mine')
      if (data.success) {
        setClassrooms(data.classrooms)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Fetch classrooms error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch classrooms')
    } finally {
      setLoading(false)
    }
  }

  // Create new classroom
  const handleCreateClassroom = async (e) => {
    e.preventDefault()
    if (!createForm.name.trim()) {
      toast.error('Classroom name is required')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/classrooms', createForm)
      if (data.success) {
        toast.success(data.message)
        setCreateForm({ name: '', description: '' })
        setShowCreateForm(false)
        fetchClassrooms()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Create classroom error:', error)
      toast.error(error.response?.data?.message || 'Failed to create classroom')
    } finally {
      setLoading(false)
    }
  }

  // Join classroom
  const handleJoinClassroom = async (e) => {
    e.preventDefault()
    if (!joinForm.inviteCode.trim()) {
      toast.error('Invite code is required')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/classrooms/join', joinForm)
      if (data.success) {
        toast.success(data.message)
        setJoinForm({ inviteCode: '' })
        setShowJoinForm(false)
        fetchClassrooms()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Join classroom error:', error)
      toast.error(error.response?.data?.message || 'Failed to join classroom')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (classroom) => {
    setClassroomToDelete(classroom)
    setShowDeleteModal(true)
    setActiveMenu(null) // Close the menu
  }

  const handleDeleteConfirm = async () => {
    if (!classroomToDelete) return

    try {
      setLoading(true)
      const { data } = await axios.delete(`${backendUrl}/api/classrooms/${classroomToDelete._id}`)
      if (data.success) {
        toast.success(data.message)
        setClassrooms(classrooms.filter(c => c._id !== classroomToDelete._id))
        setShowDeleteModal(false)
        setClassroomToDelete(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Delete classroom error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete classroom')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setClassroomToDelete(null)
  }

  const toggleMenu = (classroomId) => {
    setActiveMenu(activeMenu === classroomId ? null : classroomId)
  }

  useEffect(() => {
    if (userData) {
      fetchClassrooms()
    }
  }, [userData])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest('.relative')) {
        setActiveMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeMenu])

  if (!userData) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Classrooms</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Create Classroom
          </button>
          <button
            onClick={() => setShowJoinForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Join Classroom
          </button>
        </div>
      </div>

      {/* Create Classroom Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Classroom</h2>
            <form onSubmit={handleCreateClassroom}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classroom Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter classroom name"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter classroom description (optional)"
                  rows="3"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Classroom Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Join Classroom</h2>
            <form onSubmit={handleJoinClassroom}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Code *
                </label>
                <input
                  type="text"
                  value={joinForm.inviteCode}
                  onChange={(e) => setJoinForm({ ...joinForm, inviteCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter invite code"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Classroom</h2>
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete the classroom <strong>"{classroomToDelete?.name}"</strong>?
              </p>
              <p className="text-sm text-red-600">
                This action cannot be undone. All students will be removed from this classroom.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={handleDeleteCancel}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classrooms List */}
      {loading && classrooms.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading classrooms...</p>
        </div>
      ) : classrooms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏫</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Classrooms Yet</h3>
          <p className="text-gray-500 mb-6">Create your first classroom or join an existing one to get started!</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Create Classroom
            </button>
            <button
              onClick={() => setShowJoinForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Join Classroom
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div 
              key={classroom._id} 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-blue-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {classroom.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  classroom.isTeacher 
                    ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200' 
                    : 'bg-green-100 text-green-800 group-hover:bg-green-200'
                }`}>
                  {classroom.isTeacher ? 'Teacher' : 'Student'}
                </span>
              </div>
              
              {classroom.description && (
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {classroom.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                {classroom.isTeacher && (
                  <p><strong>Invite Code:</strong> <code className="bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-100 transition-colors duration-300">{classroom.inviteCode}</code></p>
                )}
                <p><strong>Teacher:</strong> {classroom.teacher.name}</p>
                <p><strong>Students:</strong> {classroom.students.length}</p>
                <p><strong>Created:</strong> {new Date(classroom.createdAt).toLocaleDateString()}</p>
              </div>
              
              {/* Hover indicator */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center text-blue-600 text-sm font-medium cursor-pointer hover:text-blue-700 transition-colors duration-300"
                    onClick={() => navigate(`/classroom/${classroom._id}`)}
                  >
                    <span>Click to enter classroom</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  {/* Three-dot menu - only for teachers */}
                  {classroom.isTeacher && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMenu(classroom._id)
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                        title="More options"
                      >
                        <FaEllipsisV className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown menu */}
                      {activeMenu === classroom._id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClick(classroom)
                            }}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <FaTrash className="w-4 h-4" />
                            Delete Classroom
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

export default ClassroomManager
