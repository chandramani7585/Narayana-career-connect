import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Plus, Search, Briefcase, GraduationCap, X, Filter } from "lucide-react";
import useAuth from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

function ExploreConnections() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState(
    JSON.parse(localStorage.getItem("sentRequests")) || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const loggedInUserId = Cookies.get("id");
  const {token} = useAuth();

  useEffect(()=>{
    if(!token){
        navigate('/')
    }
  },[token])

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSendRequest = async (receiverId) => {
    const senderId = Cookies.get("id");
    if (!senderId) {
      alert("Please log in to send requests.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/connections/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId, receiverId }),
      });

      if (response.ok) {
        // Show success notification
        const notification = document.getElementById(`notification-${receiverId}`);
        notification.classList.remove('opacity-0');
        setTimeout(() => {
          notification.classList.add('opacity-0');
        }, 3000);

        setSentRequests((prev) => {
          const updatedRequests = [...prev, receiverId];
          localStorage.setItem("sentRequests", JSON.stringify(updatedRequests));
          return updatedRequests;
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to send request: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.user_id !== parseInt(loggedInUserId) &&
      !sentRequests.includes(user.user_id) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mentors = filteredUsers.filter((user) => user.is_mentor);
  const students = filteredUsers.filter((user) => !user.is_mentor);

  const displayUsers = activeTab === "mentors" ? mentors : 
                      activeTab === "students" ? students : 
                      filteredUsers;

  const renderUserCard = (user) => (
    <div key={user.user_id} className="relative group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-400 to-purple-500">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          {console.log(user.profile_pic)}
            <img
              src={`http://localhost:3000/${user.profile_pic}`}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-14 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-600 mt-2">
              {user.is_mentor ? (
                <Briefcase className="w-4 h-4 mr-1" />
              ) : (
                <GraduationCap className="w-4 h-4 mr-1" />
              )}
              {user.is_mentor ? "Mentor" : "Student"}
            </span>
          </div>

          <p className="mt-4 text-sm text-gray-600 text-center line-clamp-2">
            {user.bio || "No bio available"}
          </p>

          <div className="mt-4 flex justify-center">
            <span className="px-3 py-1 rounded-md bg-purple-50 text-purple-600 text-sm">
              {user.college}
            </span>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => handleSendRequest(user.user_id)}
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={sentRequests.includes(user.user_id)}
            >
              <Plus className="w-4 h-4" />
              {sentRequests.includes(user.user_id) ? "Request Sent" : "Connect"}
            </button>
          </div>
        </div>

        {/* Success Notification */}
        <div
          id={`notification-${user.user_id}`}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg opacity-0 transition-opacity duration-300"
        >
          Request sent successfully!
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Explore Connections
            </h1>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 md:w-2/3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors md:hidden"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Tabs - Hidden on mobile when filters are shown */}
          <div className={`mt-4 border-b ${showFilters ? 'hidden md:block' : ''}`}>
            <div className="flex space-x-8">
              {['all', 'mentors', 'students'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } capitalize`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-1/2 absolute bottom-0 left-0 right-0 rounded-t-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {['all', 'mentors', 'students'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowFilters(false);
                  }}
                  className={`w-full py-3 px-4 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  } capitalize`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayUsers.map(renderUserCard)}
        </div>

        {/* Empty State */}
        {displayUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-indigo-50 inline-flex p-4 rounded-full mb-4">
              <Search className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreConnections;