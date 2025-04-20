import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MessageCircle, User, Search, ArrowLeft } from "lucide-react";
import useAuth from "../utils/AuthContext";

const Messages = () => {
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userId = Cookies.get("id");
  const { token } = useAuth();
     
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/connections/${userId}`);
        setConnections(response.data.connections);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConnections();
  }, [userId]);

  const handleNavigate = (receiverId) => {
    navigate(`/messages/${userId}/${receiverId}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  const filteredConnections = connections.filter(connection => 
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (connection.role && connection.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (connection.college && connection.college.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation and search - improved responsiveness */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:h-16">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <button 
              onClick={goBack} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Connections</h1>
          </div>
          
          <div className="relative w-full sm:max-w-md sm:ml-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </header>

      {/* Main content - improved responsive grid */}
      <main className="w-full mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : connections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center mt-8 mx-auto max-w-md">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
            <p className="text-gray-600 mb-4">Start building your professional network</p>
            <button 
              onClick={() => navigate('/network')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Network
            </button>
          </div>
        ) : (
          <>
            {searchTerm && filteredConnections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No connections found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredConnections.map((connection) => (
                  <div
                    key={connection.connection_id}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-blue-50 overflow-hidden">
                            {connection.profile_pic ? (
                              <img
                                src={`http://localhost:3000/uploads/${connection.profile_pic}`}
                                alt={`${connection.name}'s profile`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className="fallback-icon absolute inset-0 flex items-center justify-center bg-blue-50 text-blue-400"
                              style={{ display: connection.profile_pic ? 'none' : 'flex' }}
                            >
                              <User className="w-6 h-6" />
                            </div>
                          </div>
                          {/* Removed the active status indicator */}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base font-medium text-gray-900 leading-tight">
                            {connection.name}
                          </h2>
                          {(connection.role || connection.college) && (
                            <p className="text-sm text-gray-600 mt-1 leading-tight truncate">
                              {connection.role && connection.college 
                                ? `${connection.role} at ${connection.college}`
                                : connection.role || connection.college}
                            </p>
                          )}
                          {/* Removed the connection status rendering */}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleNavigate(connection.user_id)}
                          className="w-full flex justify-center items-center space-x-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Messages;