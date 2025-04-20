import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { UserPlus, Check, X, Loader2, Users, BookOpen, GraduationCap } from "lucide-react";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());
  const navigate = useNavigate();
  const loggedInUserId = Cookies.get("id");

  useEffect(() => {
    if (!loggedInUserId) {
      navigate('/login');
      return;
    }

    fetchRequests();
  }, [loggedInUserId, navigate]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/connections/requests/${loggedInUserId}`);
      const data = await response.json();
      setRequests(data.pendingRequests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (connectionId, action) => {
    setProcessingIds(prev => new Set([...prev, connectionId]));
    
    try {
      const response = await fetch("http://localhost:3000/api/connections/decide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connectionId, action }),
      });

      if (response.ok) {
        // Show success notification
        const notification = document.getElementById('success-notification');
        notification.textContent = `Request ${action === "accept" ? "accepted" : "rejected"} successfully!`;
        notification.classList.remove('opacity-0');
        setTimeout(() => {
          notification.classList.add('opacity-0');
        }, 3000);

        setRequests((prev) => prev.filter((request) => request.connection_id !== connectionId));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      // Show error notification
      const notification = document.getElementById('error-notification');
      notification.textContent = `Failed to ${action} request. Please try again.`;
      notification.classList.remove('opacity-0');
      setTimeout(() => {
        notification.classList.add('opacity-0');
      }, 3000);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(connectionId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Requests</h1>
              <p className="text-gray-600">Manage your pending connection requests</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <UserPlus className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600">You don't have any connection requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {requests.map((request) => (
              <div
                key={request.connection_id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Profile Header */}
                <div className="relative h-32 bg-gradient-to-r from-orange-400 to-orange-600">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <img
                      src={`http://localhost:3000/${request.profile_pic}`}
                      alt={request.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-16 p-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{request.name}</h2>
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-3">
                      <BookOpen className="w-4 h-4" />
                      <span>{request.role}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <GraduationCap className="w-4 h-4" />
                      <span>{request.college}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleDecision(request.connection_id, "accept")}
                      disabled={processingIds.has(request.connection_id)}
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingIds.has(request.connection_id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecision(request.connection_id, "reject")}
                      disabled={processingIds.has(request.connection_id)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div
        id="success-notification"
        className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg opacity-0 transition-opacity duration-300 z-50"
      />
      <div
        id="error-notification"
        className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg opacity-0 transition-opacity duration-300 z-50"
      />
    </div>
  );
}

export default Requests;