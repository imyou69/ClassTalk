import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Classrooms from './pages/Classrooms'
import ClassroomDetail from './pages/ClassroomDetail'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar.jsx'
import Navbar from './components/Navbar.jsx'
import { AppContent } from './context/AppContext'

const App = () => {
  const { userData } = useContext(AppContent)

  return (
    <>
      <ToastContainer />
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {userData && <Sidebar />}
          <div className={`flex-1 ${userData ? '' : 'w-full'} overflow-hidden`}>
            <main className="h-full overflow-y-auto">
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/emailverify' element={<EmailVerify />} />
                <Route path='/resetpassword' element={<ResetPassword />} />
                <Route path='/classrooms' element={<Classrooms />} />
                <Route path='/classroom/:classroomId' element={<ClassroomDetail />} />
                <Route path='/calendar' element={<div className="flex items-center justify-center h-full"><h2 className="text-2xl text-gray-500">Calendar Coming Soon</h2></div>} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
