import { useState, useEffect } from "react";
import axios from "axios";

const ChatBox = ({ projectId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // adjust to your logic
  
    // Add a check if currentUser is null or undefined
    if (!currentUser) {
      return <div>Loading...</div>; // or handle it another way
    }
  
    useEffect(() => {
      const fetchMessages = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/messages/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages);
      };
  
      fetchMessages();
    }, [projectId]);
  
    const handleSend = async () => {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/messages/send", {
        receiverId,
        projectId,
        message: newMessage,
        role: currentUser.role, // check if role is accessible
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setNewMessage("");
    };
  
    const handleMakeDeal = async () => {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/projects/make-deal/${projectId}`, {
        freelancerId: receiverId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Project status is now In Progress.");
    };
  
    return (
      <div>
        <div className="messages-box">
          {messages.map((msg, i) => (
            <div key={i} className={msg.senderId === currentUser._id ? "sent" : "received"}>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
  
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
  
        {currentUser.role === "Client" && (
          <button onClick={handleMakeDeal}>Make Deal</button>
        )}
      </div>
    );
  };
  
  export default ChatBox;
  