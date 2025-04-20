import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../utils/AuthContext';
import { 
  UserCircle, 
  Wrench, 
  BookOpen, 
  PenTool,
  Layout,
  MessageCircle,
  Briefcase,
  Settings,
  BookMarked
} from 'lucide-react';

function Dashboard() {
  const { profile, id,role } = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{
    if(role !== 'mentor'){
      navigate('/login');
    }
  },[role])

  const dashboardItems = [
    {
      title: 'Edit Profile',
      description: 'Update your personal information and preferences',
      icon: UserCircle,
      link: `/editprofile/${id}`,
      color: 'from-orange-400 to-orange-600'
    },
  
    {
      title: 'Create Story',
      description: 'Share your journey and experiences',
      icon: PenTool,
      link: '/addstory',
      color: 'from-orange-400 to-orange-600'
    },
    {
      title: 'Manage Stories',
      description: 'Edit and organize your published stories',
      icon: BookOpen,
      link: '/managestories',
      color: 'from-orange-500 to-orange-700'
    },
    {
      title: 'Career Resources',
      description: 'Access learning materials and guides',
      icon: BookMarked,
      link: '/resources',
      color: 'from-orange-400 to-orange-600'
    },
    {
      title: 'Manage Resources',
      description: 'Manage Your Resources.',
      icon: Briefcase,
      link: '/manageresources',
      color: 'from-orange-500 to-orange-700'
    },
    {
      title: 'Messages',
      description: 'Check your conversations and connections',
      icon: MessageCircle,
      link: '/messages',
      color: 'from-orange-400 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-inner">
              <img
                src={profile ? `http://localhost:3000/${profile}` : '/default-avatar.png'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to Your Dashboard</h1>
              <p className="text-orange-100">Manage your profile, skills, and career journey</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500/10 to-orange-600/10" />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;