import React, { useContext, useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        navigate('/emailverify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setShowDropdown(false)
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')

      if (data.success) {
        setIsLoggedin(false)
        setUserData(null) // reset to null instead of false
        toast.success('Logged out successfully!')
        navigate('/')
      } else {
        toast.error(data.message || 'Logout failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setShowDropdown(false)
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/favicon.svg" alt="App Logo" className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-gray-800">ClassTalk</span>
            <p className="text-xs text-gray-500 -mt-1">Education Platform</p>
          </div>
        </div>
      </div>

      {/* User Section */}
      {userData ? (
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {/* User greeting */}
          <span className="text-gray-700 font-medium text-sm sm:text-lg hidden sm:block">
            Hey, {userData.name}
          </span>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md"
            >
              <span className="text-sm sm:text-base font-semibold">
                {userData.name[0].toUpperCase()}
              </span>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
                
                <ul className="py-1">
                  {!userData.isVerified && (
                    <li>
                      <button
                        onClick={sendVerificationOtp}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Verify Email
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-4 sm:px-6 py-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md"
        >
          <span className="text-sm sm:text-base font-medium">Login</span>
          <img src={assets.arrow_icon} alt="" className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Navbar
