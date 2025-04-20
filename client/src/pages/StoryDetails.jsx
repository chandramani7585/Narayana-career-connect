import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";

const StoryDetails = () => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { story_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/stories/${story_id}`);
        setStory(response.data.story);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching story:", error);
        setError("Failed to load story. Please try again later.");
        setLoading(false);
      }
    };
    fetchStory();
  }, [story_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <span className="mr-3">ℹ️</span>
            <span>{error}</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/stories")}
          className="mt-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Stories
        </button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-xl font-medium text-gray-800">Story not found</h3>
          <p className="text-gray-600 mt-2">The story you're looking for doesn't exist or was removed.</p>
          <button
            onClick={() => navigate("/stories")}
            className="mt-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/stories")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Stories
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm flex items-center shadow-sm">
              <Tag size={14} className="mr-1" />
              {story.suggested_skill_name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-xl border border-gray-100 shadow-md overflow-hidden">
              
                <img
                  src={`http://localhost:3000/uploads/${story.thumbnail}`}
                  alt={story.story_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.webp';
                  }}
                />
            
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {story.story_name}
              </h1>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {story.story_description}
              </p>

              <div 
                className="prose max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: story.content }}
              />
            </div>
          </div>

          {/* Right column - Author info and metadata */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About the Author</h3>
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-700 font-medium text-xl">
                    {story.author_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">{story.author_name}</p>
                  <p className="text-gray-500 mt-1">Contributor</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Story Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-3 text-indigo-500" />
                  <span>Posted on {formatDate(story.created_at)}</span>
                </div>
                
                {story.created_at !== story.updated_at && (
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-3 text-indigo-500" />
                    <span>Updated on {formatDate(story.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Skills</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                  {story.suggested_skill_name}
                </span>
                {/* You could add more related skills here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetails;