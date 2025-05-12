import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "components/ChatSidebar";
import ChatWindow from "components/ChatWindow";
import { io } from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatPage = () => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);


  // Fetching users and current user logic (same as before)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/users-with-chat", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/get-current-user", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCurrentUserId(res.data._id); // This should now be the logged-in user's real ID
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  // Initialize Socket.io connection
  useEffect(() => {
    const socketConnection = io("http://localhost:5000", {
      transports: ["websocket"], // Ensure we're using WebSocket transport for efficiency
    });
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Join chat room for the current user when the component is mounted
  useEffect(() => {
    if (socket && currentUserId) {
      socket.emit("login", currentUserId);   // name as in the backend
    }
  }, [socket, currentUserId]);

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message) => {
        // Update messages state with the new message
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage"); // Clean up the listener
      }
    };
  }, [socket]);

  useEffect(() => {
  if (socket) {
    socket.on("newNotification", (notification) => {
      console.log("New notification received:", notification);
      // You can update a state here to show the notification to the user
      // For example:
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });
  }

  return () => {
    if (socket) {
      socket.off("newNotification");
    }
  };
}, [socket]);

  // Fetch initial messages for the chat
  useEffect(() => {
    if (userId) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`http://localhost:5000/api/messages/get-msg/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          setMessages(res.data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUserId && userId) {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          "http://localhost:5000/api/messages/send-msg",
          {
            senderId: currentUserId,
            receiverId: userId,
            text: newMessage,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

      
        setNewMessage("");
        console.log("Receiver found:", userId);

      } catch (err) {
        console.error("Error sending message:", err.response?.data || err.message);
      }
    }
  };

  return (
    <div className="container py-5 px-4">
      <div className="row rounded-lg overflow-hidden shadow">
        <Sidebar users={users} />
        <div className="col-7 px-0">
          <ChatWindow
            messages={messages}
            selectedUser={userId}
            currentUserId={currentUserId}
          />
          <div className="bg-light px-4 py-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="btn btn-primary"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;