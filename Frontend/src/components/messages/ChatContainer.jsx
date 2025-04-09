import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatstore";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { formatMessageTime } from "../utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  
  const [authUser, setAuthUser] = useState(null); // Local state to store authUser data
  const messageEndRef = useRef(null);

  // Get authUser from localStorage on component mount
  useEffect(() => {
    const storedAuthUser = JSON.parse(localStorage.getItem("authUser"));
    setAuthUser(storedAuthUser);
  }, []);

  // Subscribe to messages when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="d-flex flex-column overflow-auto">
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // If authUser is not loaded, show loading state
  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column overflow-auto">
      <div className="flex-grow-1 overflow-auto p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`d-flex ${message.senderId === authUser._id ? "justify-content-end" : "justify-content-start"} mb-3`}
          >
            <div className="avatar">
              <img
                src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                alt="profile pic"
                className="rounded-circle size-10 border"
              />
            </div>
            <div className="d-flex flex-column ms-2">
              <div className="text-muted small">{formatMessageTime(message.createdAt)}</div>
              <div className="d-flex flex-column">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="img-fluid rounded-2 mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} /> {/* Scroll target */}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
