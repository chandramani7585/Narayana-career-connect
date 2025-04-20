import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Send, MessageSquare } from "lucide-react";

const Messaging = () => {
  const { senderId, receiverId } = useParams(); // Get sender and receiver IDs from the route
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const userId = Cookies.get("id");
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/messages/user/${senderId}/receiver/${receiverId}`
        );
        setMessages(response.data.messages);
        // Scroll to bottom after messages load
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 5000); // Poll messages every 5 seconds
    return () => clearInterval(interval);
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      await axios.post("http://localhost:3000/api/messages/send", {
        senderId: userId,
        receiverId,
        content,
      });
      setContent(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Fixed header */}
      <div className="bg-indigo-600 p-4 shadow-md">
        <div className="flex items-center">
          <MessageSquare className="text-white mr-2" size={20} />
          <h1 className="text-2xl font-bold text-white">Chat</h1>
        </div>
      </div>
      
      {/* Scrollable message area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {messages.map((message) => (
          <div
            key={message.message_id}
            className={`mb-3 ${
              message.sender_id === parseInt(userId)
                ? "text-right"
                : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.sender_id === parseInt(userId)
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-700 shadow-sm"
              } max-w-xs sm:max-w-sm md:max-w-md`}
              dangerouslySetInnerHTML={{ __html: message.content }}
            ></div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(message.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Fixed input area at bottom */}
      <div className="border-t bg-white p-4 shadow-lg">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="bg-white rounded-lg"
          
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center"
          >
            <span>Send</span>
            <Send size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messaging;