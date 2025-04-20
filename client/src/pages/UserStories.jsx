import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
   const {id} = useParams();
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/stories/user/${id}`);
        setStories(response.data.stories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setError("Failed to load stories. Please try again later.");
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-orange-800">Stories</h1>
    
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-12 bg-orange-50 rounded-xl">
          <h3 className="text-xl font-medium text-orange-900">No stories found</h3>
          <p className="text-orange-600 mt-2">Be the first to share a story!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.story_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 bg-orange-100">
                <img
                  src={`http://localhost:3000/uploads/${story.thumbnail}`}
                  alt={story.story_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.webp';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                    {story.suggested_skill_name}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center">
                    <span className="text-orange-800 font-medium">
                      {story.author_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{story.author_name}</p>
                    <p className="text-sm text-gray-500">{formatDate(story.created_at)}</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {story.story_name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {story.story_description}
                </p>

                <button
                  onClick={() => navigate(`/story/${story.story_id}`)}
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                >
                  Read more →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStories;