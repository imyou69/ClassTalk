import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {
  const { userData } = useContext(AppContent)
  const navigate = useNavigate()

  // Show dashboard if user is logged in
  if (userData) {
    return (
      <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img
          src={assets.header_img}
          alt=""
          className='w-36 h-36 rounded-full mb-6'
        />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
          Hey {userData.name}!
          <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
        </h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to ClassTalk</h2>
        <p className='mb-8 max-w-md'>Manage your virtual classrooms and connect with students!</p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/classrooms')}
            className='bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-8 py-3 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          >
            Manage Classrooms
          </button>
          <button 
            onClick={() => navigate('/calendar')}
            className='border border-gray-500 rounded-full px-8 py-3 hover:bg-gray-100 transition-all duration-200'
          >
            View Calendar
          </button>
        </div>
      </div>
    )
  }

  // Default welcome content for logged out users
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img
        src={assets.header_img}
        alt=""
        className='w-36 h-36 rounded-full mb-6'
      />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Hey Developer!
        <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
      </h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to ClassTalk</h2>
      <p className='mb-8 max-w-md'>Create and manage virtual classrooms with ease. Join as a teacher or student to get started!</p>
      <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header
