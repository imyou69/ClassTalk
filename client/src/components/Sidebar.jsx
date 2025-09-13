import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaHome, FaCalendarAlt, FaUserFriends, FaChalkboardTeacher, FaBoxOpen, FaCog } from 'react-icons/fa'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/classrooms', icon: FaChalkboardTeacher, label: 'Classrooms' },
    { path: '/calendar', icon: FaCalendarAlt, label: 'Calendar' },
  ]

  return (
    <aside 
      className={`bg-gray-50 shadow-lg border-r border-gray-200 h-full overflow-y-auto transition-all duration-300 ease-in-out ${
        isHovered ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-full flex flex-col ${isHovered ? 'p-6' : 'p-4'}`}>
        {/* Logo Section */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/favicon.svg" alt="App Logo" className="w-6 h-6" />
          </div>
          {isHovered && (
            <div className="ml-3 transition-all duration-300">
              <span className="text-xl font-bold text-gray-800">ClassTalk</span>
              <p className="text-xs text-gray-500">Education Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button 
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full gap-3 rounded-lg font-medium focus:outline-none transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  } ${isHovered ? 'px-4 py-3' : 'px-2 py-3 justify-center'}`}
                  title={!isHovered ? item.label : ''}
                >
                  <div className={`flex items-center justify-center ${isHovered ? 'w-6 h-6' : 'w-8 h-8'}`}>
                    <item.icon className={`${isHovered ? 'text-lg' : 'text-xl'}`} />
                  </div>
                  {isHovered && (
                    <span className="text-sm transition-all duration-300">{item.label}</span>
                  )}
                </button>
              </li>
            ))}

            <li className="mt-8">
              <div className="border-t border-gray-200 pt-4">
                {isHovered && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 transition-all duration-300">
                    Quick Actions
                  </h3>
                )}
                <ul className="flex flex-col gap-2">
                  <li>
                    <button 
                      className={`flex items-center w-full gap-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 ${
                        isHovered ? 'px-4 py-2.5' : 'px-2 py-2.5 justify-center'
                      }`}
                      title={!isHovered ? 'My Students' : ''}
                    >
                      <div className={`flex items-center justify-center ${isHovered ? 'w-6 h-6' : 'w-8 h-8'}`}>
                        <FaUserFriends className={`${isHovered ? 'text-sm' : 'text-lg'}`} />
                      </div>
                      {isHovered && (
                        <span className="text-sm transition-all duration-300">My Students</span>
                      )}
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`flex items-center w-full gap-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 ${
                        isHovered ? 'px-4 py-2.5' : 'px-2 py-2.5 justify-center'
                      }`}
                      title={!isHovered ? 'Archived Classes' : ''}
                    >
                      <div className={`flex items-center justify-center ${isHovered ? 'w-6 h-6' : 'w-8 h-8'}`}>
                        <FaBoxOpen className={`${isHovered ? 'text-sm' : 'text-lg'}`} />
                      </div>
                      {isHovered && (
                        <span className="text-sm transition-all duration-300">Archived Classes</span>
                      )}
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`flex items-center w-full gap-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 ${
                        isHovered ? 'px-4 py-2.5' : 'px-2 py-2.5 justify-center'
                      }`}
                      title={!isHovered ? 'Settings' : ''}
                    >
                      <div className={`flex items-center justify-center ${isHovered ? 'w-6 h-6' : 'w-8 h-8'}`}>
                        <FaCog className={`${isHovered ? 'text-sm' : 'text-lg'}`} />
                      </div>
                      {isHovered && (
                        <span className="text-sm transition-all duration-300">Settings</span>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            </li>
        </ul>
      </nav>
        
        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          {isHovered && (
            <div className="text-center transition-all duration-300">
              <p className="text-xs text-gray-500 font-medium">ClassTalk v1.0</p>
              <p className="text-xs text-gray-400">© 2024</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
