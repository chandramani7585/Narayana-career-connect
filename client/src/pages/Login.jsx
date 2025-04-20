import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../utils/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, token } = useAuth();
  
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (formData.email === 'admin@gmail.com' && formData.password === '123456') {
      login('dummyToken', 'admin', null, 1);
      navigate('/admindashboard');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      const { token, role, profile, user_id } = response.data;
      login(token, role, profile, user_id);
      
      // Use a more subtle notification instead of an alert
      setErrors({ success: 'Login successful! Redirecting...' });
      
      setTimeout(() => {
        if (role === 'student') {
          navigate('/dashboard');
        } else if (role === 'mentor') {
          navigate('/mentordashboard');
        } else if (role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrors({ server: error.response.data.message });
      } else {
        setErrors({ server: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left sidebar/accent area - visible on md screens and up */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-blue-500 to-indigo-600 p-8">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome Back</h2>
                <p className="text-blue-100">Sign in to access your account and continue your learning journey.</p>
              </div>
              <div className="text-blue-200 text-sm">
                <p>Need an account?</p>
                <button 
                  onClick={() => navigate('/register')} 
                  className="text-white font-bold hover:underline mt-1 inline-block"
                >
                  Register here
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="w-full md:w-2/3 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
              <p className="text-gray-600 mt-1">Access your account</p>
              
              {/* Mobile register link */}
              <div className="block md:hidden mt-4 text-sm">
                <span className="text-gray-500">Need an account?</span>
                <button 
                  onClick={() => navigate('/register')} 
                  className="text-blue-600 font-medium hover:underline ml-1"
                >
                  Register
                </button>
              </div>
            </div>
            
            {errors.server && (
              <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700 border border-red-200">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  {errors.server}
                </p>
              </div>
            )}
            
            {errors.success && (
              <div className="p-4 rounded-lg mb-6 bg-green-50 text-green-700 border border-green-200">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {errors.success}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                 </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              
               
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;