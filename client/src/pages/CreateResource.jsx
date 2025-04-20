import React, { useEffect, useState } from 'react';
import useAuth from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

function CreateResource() {
    const { token, role } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if(!token) {
            navigate('/')
        }
    }, [token, navigate])

    const [formData, setFormData] = useState({
        type: '',
        resourceName: '',
        resourceDescription: '',
        content: '',
        suggestedSkill: '',
    });
    
    const [skills, setSkills] = useState([]);
    const [mentorId, setMentorId] = useState(null);

    useEffect(() => {
        if (role !== 'mentor' || !token) {
            navigate("/login");
        }
    }, [role, token, navigate]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch skills
                const skillsResponse = await axios.get('http://localhost:3000/api/skills/all');
                setSkills(skillsResponse.data.skills);
                
                // Fetch mentor ID
                const userId = Cookies.get("id");
                const mentorResponse = await axios.get(`http://localhost:3000/api/mentorconnections/mentors/${userId}`);
                setMentorId(mentorResponse.data.mentor.mentor_id);
            } catch (error) {
                console.error("Error fetching initial data:", error);
                setFormError("Failed to load necessary data. Please refresh the page.");
            }
        }

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuillChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError('');
        
        if (!mentorId) {
            setFormError("Mentor ID is not available.");
            setIsLoading(false);
            return;
        }

        const data = {
            type: formData.type,
            resource_name: formData.resourceName,
            resource_description: formData.resourceDescription,
            content: formData.content,
            suggested_skill: parseInt(formData.suggestedSkill, 10),
            mentor_id: mentorId,
        };

        try {
            await axios.post('http://localhost:3000/api/resources/add', data);
            setIsLoading(false);
            
            // Success feedback
            const notification = document.getElementById('notification');
            notification.classList.remove('hidden');
            setTimeout(() => {
                notification.classList.add('hidden');
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response?.data?.message || 'Failed to create resource. Please try again.';
            setFormError(`Error: ${errorMessage}`);
        }
    };

    const resourceTypes = [
        { value: 'article', label: 'Article' },
        { value: 'video', label: 'Video' },
        { value: 'pdf', label: 'PDF' },
        { value: 'course', label: 'Course' },
    ];

    return (
        <div className="min-h-screen   p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Create a New Resource</h1>
                    <p className="text-gray-600 mt-2">Share your knowledge with your mentees</p>
                </div>

                {/* Success Notification */}
                <div id="notification" className="hidden fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out">
                    Resource created successfully!
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {formError && (
                        <div className="bg-red-50 text-red-700 p-4 border-l-4 border-red-500">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Resource Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                                <select 
                                    name="type"
                                    value={formData.type} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                                >
                                    <option value="">Select type</option>
                                    {resourceTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Suggested Skill */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Related Skill</label>
                                <select 
                                    name="suggestedSkill"
                                    value={formData.suggestedSkill} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                                >
                                    <option value="">Select a skill</option>
                                    {skills.map((skill) => (
                                        <option key={skill.skill_id} value={skill.skill_id}>
                                            {skill.skill_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Resource Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
                            <input 
                                type="text" 
                                name="resourceName"
                                value={formData.resourceName} 
                                onChange={handleChange} 
                                required 
                                placeholder="Give your resource a clear, descriptive title"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                            />
                        </div>

                        {/* Resource Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
                            <textarea 
                                name="resourceDescription"
                                value={formData.resourceDescription} 
                                onChange={handleChange} 
                                required 
                                rows="3"
                                placeholder="Provide a short summary of what this resource covers"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <ReactQuill 
                                    value={formData.content} 
                                    onChange={handleQuillChange}
                                    placeholder="Create your resource content here..." 
                                    className="h-64"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`w-full rounded-lg py-3 px-4 flex justify-center items-center text-white font-medium transition duration-200 ${
                                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : 'Publish Resource'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="text-gray-600 hover:text-orange-600 font-medium transition duration-200"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateResource;