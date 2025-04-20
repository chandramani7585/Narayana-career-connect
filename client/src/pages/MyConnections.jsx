import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/AuthContext";

function MyConnections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedInUserId = Cookies.get("id");
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token]);

  useEffect(() => {
    fetch(`http://localhost:3000/connections/${loggedInUserId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch connections");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setConnections(data.connections || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching connections:", error);
        setLoading(false);
      });
  }, [loggedInUserId]);

  const handleReject = async (connectionId) => {
    try {
      const response = await fetch("http://localhost:3000/connections/decide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connectionId, action: "reject" }),
      });

      if (response.ok) {
        setConnections((prev) =>
          prev.filter((conn) => conn.connection_id !== connectionId)
        );

        const storedConnections = JSON.parse(localStorage.getItem("sentRequests")) || [];
        const updatedConnections = storedConnections.filter((id) => id !== connectionId);
        localStorage.setItem("sentRequests", JSON.stringify(updatedConnections));
      } else {
        const errorData = await response.json();
        alert(`Failed to reject request: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error rejecting connection:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-lg font-bold text-pink-500 animate-bounce">
          LOADING...
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-lg font-bold text-pink-500">
          NO CONNECTIONS FOUND
        </div>
      </div>
    );
  }

  // Generate random background colors for variety
  const getBgColor = (index) => {
    const colors = [
      "bg-pink-500", "bg-purple-500", "bg-yellow-500", 
      "bg-orange-500", "bg-cyan-500", "bg-emerald-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-black py-10 px-6">
      <h1 className="text-4xl font-black text-white mb-12 tracking-tight">
        <span className="text-pink-500">/</span> MY CONNECTIONS
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {connections.map((connection, index) => (
          <div key={connection.connection_id} className="relative">
            {/* Decorative background element */}
            <div className={`absolute -inset-1 ${getBgColor(index)} blur-sm opacity-70 rounded-lg`}></div>
            
            <div className="relative bg-black border border-gray-800 p-6 rounded-lg flex flex-col">
              <div className="absolute top-3 right-3 flex gap-2">
                <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              </div>
              
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-16 h-16 rounded-md overflow-hidden ring-2 ring-offset-2 ring-offset-black ${getBgColor(index)}`}>
                  <img
                    src={`https://ncc-server-production.up.railway.app/${connection.profile_pic}`}
                    alt={connection.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/100?text=404";
                    }}
                  />
                </div>
                
                <div>
                  <h2 className="text-white font-bold text-xl">
                    {connection.name}
                  </h2>
                  <div className="text-gray-400 font-medium">
                    {connection.role}
                  </div>
                </div>
              </div>
              
              <div className="px-3 py-2 bg-gray-900 rounded text-gray-400 text-sm mb-5">
                {connection.college}
              </div>
              
              <button
                onClick={() => handleReject(connection.connection_id)}
                className="mt-auto text-center py-2 border border-gray-800 text-white hover:bg-gray-900 transition-colors duration-200 uppercase text-sm font-bold tracking-wide rounded"
              >
                Disconnect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyConnections;