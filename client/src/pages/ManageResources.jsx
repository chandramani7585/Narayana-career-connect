import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import useAuth from '../utils/AuthContext';
import { Loader2, Plus, Trash2, Edit2, ExternalLink, AlertTriangle } from 'lucide-react';

function ManageResources() {
  const [resources, setResources] = useState([]);
  const [mentorId, setMentorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMentorId = async () => {
      try {
        const userId = Cookies.get('id');
        const response = await axios.get(`http://localhost:3000/api/mentorconnections/mentors/${userId}`);
        setMentorId(response.data.mentor.mentor_id);
      } catch (error) {
        console.error('Error fetching mentor details:', error);
        setError('Unable to fetch mentor information. Please try again later.');
        setLoading(false);
      }
    };

    fetchMentorId();
  }, []);

  useEffect(() => {
    if (mentorId) {
      const fetchResources = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/resources/mentor/${mentorId}`);
          setResources(response.data.resources);
        } catch (error) {
          console.error('Error fetching resources:', error);
          setError('Failed to load resources. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchResources();
    }
  }, [mentorId]);

  const handleDelete = async (resourceId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/resources/delete/${resourceId}`);
      setResources(resources.filter((resource) => resource.resource_id !== resourceId));
      setDeleteConfirm(null);
      // Using toast-like notification
      showNotification('Resource deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting resource:', error);
      showNotification('Failed to delete resource. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resourceId) => {
    navigate(`/edit-resource/${resourceId}`);
  };

  const showNotification = (message, type) => {
    // In a real implementation, you would integrate with a toast library
    // This is a simple mock implementation
    alert(message);
  };

  // Function to get resource type icon
  const getResourceTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return '🎬';
      case 'article': return '📄';
      case 'course': return '🎓';
      case 'book': return '📚';
      default: return '📌';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Resources</h1>
          <button
            onClick={() => navigate('/createresource')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Resource</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading resources...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : resources.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4">
              <h2 className="font-medium text-gray-700">Your Learning Resources</h2>
            </div>
            <ul className="divide-y">
              {resources.map((resource) => (
                <li key={resource.resource_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                        <span className="text-lg">{getResourceTypeIcon(resource.type)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{resource.resource_name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {resource.resource_description || "No description provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       
                      
                      <button
                        onClick={() => setDeleteConfirm(resource.resource_id)}
                        className="p-2 text-gray-500 hover:text-rose-600 rounded-full hover:bg-rose-50"
                        title="Delete Resource"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No resources yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't created any learning resources. Start by adding your first resource.
            </p>
            <button
              onClick={() => navigate('/createresource')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Resource</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this resource? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageResources;