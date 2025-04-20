import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useAsyncValue } from 'react-router-dom';
import useAuth from '../utils/AuthContext'
function EditProfile() {
  const { id } = useParams();
  const {token} = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    currentYear: '',
    currentSem: '',
    isPastStudent: false,
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState(null);
  const navigate = useNavigate(); 
   useEffect(()=>{
      if(!token){
          navigate('/')
      }
    },[token])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${id}`);
        const { name, bio, current_year, current_sem, is_past_student } = response.data;
        setFormData({
          name,
          bio,
          currentYear: current_year,
          currentSem: current_sem,
          isPastStudent: is_past_student === 1,
        });
      } catch (error) {
        setServerMessage({ type: 'error', text: 'Failed to fetch profile data.' });
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/api/users/${id}`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data && response.data.message) {
        setServerMessage({ type: 'success', text: response.data.message });
      }

      navigate(`/dashboard`);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrors({ server: error.response.data.message });
      } else {
        setErrors({ server: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-50">
      <div className="card w-full max-w-lg p-6 shadow-lg bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-orange-500 mb-4">Edit Profile</h1>

        {serverMessage && (
          <div className={`alert ${serverMessage.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
            <span>{serverMessage.text}</span>
          </div>
        )}

        {errors.server && (
          <div className="alert alert-error mb-4">
            <span>{errors.server}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Current Year</label>
            <input
              type="number"
              name="currentYear"
              value={formData.currentYear}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Current Semester</label>
            <input
              type="number"
              name="currentSem"
              value={formData.currentSem}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Are you a past student?</label>
            <input
              type="checkbox"
              name="isPastStudent"
              checked={formData.isPastStudent}
              onChange={handleChange}
              className="checkbox checkbox-orange"
            />
          </div>

          <button type="submit" className="btn btn-orange-500 w-full hover:bg-orange-600 text-white">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
