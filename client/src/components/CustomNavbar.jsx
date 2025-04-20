import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../utils/AuthContext';
import { 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  User, 
  BookOpen, 
  Users, 
  Briefcase, 
  MessageSquare, 
  BookMarked,
  Bell
} from 'lucide-react';

const CustomNavbar = () => {
  const { token, role, profile, logout, id } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and brand name */}
          <Link to="/" className="flex items-center">
            <span className="md:text-2xl text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-blue-500 transition-all">
              Narayana Career Connect
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none group">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 group-hover:border-blue-500 transition-all shadow-md">
                    {profile ? (
                      <img
                        alt="Profile"
                        src={`http://localhost:3000/${profile}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        alt="Default avatar"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </button>

                {/* Dropdown menu */}
                <div className="invisible group-hover:visible absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                  <div className="p-2 space-y-1">
                    {role !== 'admin' && (
                      <>
                        <Link
                          to="/stories"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          Stories
                        </Link>
                        <Link
                          to="/connections"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          Explore Connections
                        </Link>
                        {role === 'student' && (
                          <Link
                            to="/jobs"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                          >
                            <Briefcase className="w-4 h-4" />
                            Explore Jobs
                          </Link>
                        )}
                        <Link
                          to="/myconnections"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          Connections
                        </Link>
                        <Link
                          to="/requests"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <Bell className="w-4 h-4" />
                          Requests
                        </Link>
                        <Link
                          to="/resources"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <BookMarked className="w-4 h-4" />
                          Resources
                        </Link>
                        <Link
                          to="/messages"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Messages
                        </Link>
                      </>
                    )}
                    
                    {role === 'student' && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}
                    
                    {role === 'mentor' && (
                      <>
                        <Link
                          to="/mentordashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Mentor Dashboard
                        </Link>
                        <Link
                          to="/createresource"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <BookMarked className="w-4 h-4" />
                          Add Resource
                        </Link>
                        <Link
                          to="/manageresources"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                        >
                          <BookMarked className="w-4 h-4" />
                          Manage Resources
                        </Link>
                      </>
                    )}
                    
                    {role === 'admin' && (
                      <Link
                        to="/admindashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/register"
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-700 border border-indigo-600 hover:border-indigo-700 rounded-md transition-colors hover:bg-indigo-50"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-md transition-colors shadow-md"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 shadow-lg">
            {token ? (
              <>
                {role !== 'admin' && (
                  <>
                    <Link
                      to="/stories"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Stories
                    </Link>
                    <Link
                      to="/connections"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Explore Connections
                    </Link>
                    {role === 'student' && (
                      <Link
                        to="/jobs"
                        className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Explore Jobs
                      </Link>
                    )}
                    <Link
                      to="/myconnections"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connections
                    </Link>
                    <Link
                      to="/requests"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Requests
                    </Link>
                    <Link
                      to="/resources"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Resources
                    </Link>
                    <Link
                      to="/messages"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </Link>
                  </>
                )}
                
                {role === 'student' && (
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                
                {role === 'mentor' && (
                  <>
                    <Link
                      to="/mentordashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mentor Dashboard
                    </Link>
                    <Link
                      to="/createresource"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Resource
                    </Link>
                    <Link
                      to="/manageresources"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Manage Resources
                    </Link>
                  </>
                )}
                
                {role === 'admin' && (
                  <Link
                    to="/admindashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 p-2">
                <Link
                  to="/register"
                  className="px-4 py-2 text-center text-indigo-600 hover:text-indigo-700 border border-indigo-600 hover:border-indigo-700 rounded-md transition-colors hover:bg-indigo-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-center bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomNavbar;