import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../utils/AuthContext';
import { 
  UserCircle, 
  Wrench, 
  BookOpen, 
  PenTool,
  MessageCircle,
  BookMarked,
  ChevronRight
} from 'lucide-react';

function Dashboard() {
  const { profile, id, role, token } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  useEffect(() => {
    if(role === 'mentor') {
      navigate('/mentordashboard');
    }
    if(role === "admin") {
      navigate("/admindashboard");
    }
  }, [role, navigate]);

  const dashboardItems = [
    {
      title: 'Edit Profile',
      description: 'Update your personal information and preferences',
      icon: UserCircle,
      link: `/editprofile/${id}`,
      color: 'bg-indigo-500'
    },
    {
      title: 'Manage Skills',
      description: 'Add or update your professional skills',
      icon: Wrench,
      link: `/addskills/${id}`,
      color: 'bg-blue-500'
    },
    {
      title: 'Create Story',
      description: 'Share your journey and experiences',
      icon: PenTool,
      link: '/addstory',
      color: 'bg-cyan-500'
    },
    {
      title: 'Manage Stories',
      description: 'Edit and organize your published stories',
      icon: BookOpen,
      link: '/managestories',
      color: 'bg-teal-500'
    },
    {
      title: 'Career Resources',
      description: 'Access learning materials and guides',
      icon: BookMarked,
      link: '/resources',
      color: 'bg-emerald-500'
    },
    {
      title: 'Messages',
      description: 'Check your conversations and connections',
      icon: MessageCircle,
      link: '/messages',
      color: 'bg-sky-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/50 shadow-lg flex-shrink-0">
                 <img
                  src={profile ? `http://localhost:3000/uploads/${profile}` : '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to Your Dashboard</h1>
                <p className="text-blue-100 text-lg">Manage your profile, skills, and career journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className={`${item.color} p-4 rounded-lg shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
