import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddStoryComponent = () => {
  const [storyName, setStoryName] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [content, setContent] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/skills/all");
        setSkills(response.data.skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError("Failed to load skills. Please try again later.");
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authorId = Cookie.get("id");

    if (!storyName || !storyDescription || !content || !selectedSkill || !authorId) {
      setError("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("story_name", storyName);
    formData.append("story_description", storyDescription);
    formData.append("content", content);
    formData.append("author", authorId);
    formData.append("suggested_skill", selectedSkill);
    formData.append("thumbnail", thumbnail || "placeholder-image.webp");

    try {
      const response = await axios.post("http://localhost:3000/api/stories/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Story added successfully!");
      navigate("/stories");
    } catch (error) {
      console.error("Error adding story:", error);
      setError("Failed to add story. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      // Create preview URL
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans bg-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl text-indigo-700 font-bold">Create Your Story</h2>
        <button
          onClick={() => navigate("/stories")}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Back to Stories
        </button>
      </div>

      {error && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 px-4 py-3 rounded mb-6 shadow-sm">
          <div className="flex">
            <div className="py-1">
              <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 px-4 py-3 rounded mb-6 shadow-sm">
          <div className="flex">
            <div className="py-1">
              <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>{success}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <label className="block text-gray-700 font-medium mb-3">
              Story Title
            </label>
            <input
              type="text"
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              placeholder="Enter your story title..."
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <label className="block text-gray-700 font-medium mb-3">
              Story Description
            </label>
            <textarea
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white resize-none"
              placeholder="Write a brief description..."
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <label className="block text-gray-700 font-medium mb-3">
              Content
            </label>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "blockquote", "code-block"],
                    ["clean"],
                  ],
                }}
                className="h-64"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <label className="block text-gray-700 font-medium mb-3">
              Suggested Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">Select a skill</option>
              {skills.map((skill) => (
                <option key={skill.skill_id} value={skill.skill_id}>
                  {skill.skill_name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <label className="block text-gray-700 font-medium mb-3">
              Thumbnail
            </label>
            <div className="flex flex-col items-center">
              {thumbnailPreview ? (
                <div className="mb-4 relative">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                  <svg className="w-12 h-12 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 text-center">
                    Drag & drop an image or click to browse
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md"
          >
            Publish Story
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStoryComponent;