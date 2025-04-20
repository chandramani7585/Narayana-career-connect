import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        email: '',
        role: 'student',
        bio: '',
        is_past_student: 0,
        current_year: '',
        current_sem: '',
        profile_pic: null,
        college: 'NECN',  
    });
      
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
         } else if (type === 'checkbox') {
                setFormData({ ...formData, [name]: checked ? 1 : 0 });
            } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formPayload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formPayload.append(key, value);
        });

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data && response.data.message) {
                setServerMessage({ type: 'success', text: response.data.message });
            } else {
                setServerMessage({ type: 'error', text: 'Registration failed. Please try again.' });
            }

            if (response.data.success) {
                setTimeout(() => navigate('/login'), 1500);
            }
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
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Left sidebar/accent area - visible on md screens and up */}
                    <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-blue-500 to-indigo-600 p-8">
                        <div className="h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
                                <p className="text-blue-100 mb-8">Create an account to connect with mentors and access learning resources.</p>
                            </div>
                            <div className="text-blue-200 text-sm">
                                <p>Already have an account?</p>
                                <a href="/login" className="text-white font-bold hover:underline mt-1 inline-block">
                                    Sign in here
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="w-full md:w-2/3 p-6 md:p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
                            <p className="text-gray-600 mt-1">Fill in your details to get started</p>
                            
                            {/* Mobile login link */}
                            <div className="block md:hidden mt-4 text-sm">
                                <span className="text-gray-500">Already have an account?</span>
                                <a href="/login" className="text-blue-600 font-medium hover:underline ml-1">
                                    Sign in
                                </a>
                            </div>
                        </div>
                        
                        {serverMessage && (
                            <div className={`p-4 rounded-lg mb-6 ${
                                serverMessage.type === 'success' 
                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                    : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                <p className="flex items-center">
                                    {serverMessage.type === 'success' ? (
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                        </svg>
                                    )}
                                    {serverMessage.text}
                                </p>
                            </div>
                        )}
                        
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your.email@example.com"
                                        className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a secure password"
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="student">Student</option>
                                        <option value="mentor">Mentor</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                                    <select
                                        name="college"
                                        value={formData.college}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="NECN">NECN</option>
                                        <option value="NECG">NECG</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself"
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            {formData.role === 'mentor' && (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_past_student"
                                        id="is_past_student"
                                        checked={formData.is_past_student === 1}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_past_student" className="ml-2 block text-sm text-gray-700">
                                        I am a past student of this institution
                                    </label>
                                </div>
                            )}

                            {formData.role === 'student' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
                                        <input
                                            type="number"
                                            name="current_year"
                                            value={formData.current_year}
                                            onChange={handleChange}
                                            placeholder="e.g., 1, 2, 3, 4"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
                                        <input
                                            type="number"
                                            name="current_sem"
                                            value={formData.current_sem}
                                            onChange={handleChange}
                                            placeholder="e.g., 1, 2, 3, 4, 5, 6, 7, 8"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                <div className="mt-1 flex items-center">
                                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                        {formData.profile_pic ? (
                                            <img 
                                                src={URL.createObjectURL(formData.profile_pic)} 
                                                alt="Profile preview" 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        )}
                                    </span>
                                    <label 
                                        htmlFor="profile_pic_upload" 
                                        className="ml-5 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Upload
                                        <input
                                            id="profile_pic_upload"
                                            type="file"
                                            name="profile_pic"
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                    </label>
                                    {formData.profile_pic && (
                                        <span className="ml-2 text-sm text-gray-500">
                                            {formData.profile_pic.name}
                                        </span>
                                    )}
                                </div>
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
                                        Processing...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;