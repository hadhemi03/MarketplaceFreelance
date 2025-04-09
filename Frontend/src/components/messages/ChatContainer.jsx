import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "utils/MessageFormat.js"; 

const ChatContainer = () => {
  // ✅ Static mock data
  const authUser = {
    _id: "user1",
    profilePic: "/avatar.png",
  };

  const selectedUser = {
    _id: "user2",
    profilePic: "/avatar.png",
  };

  const messages = [
    {
      _id: "m1",
      senderId: "user1",
      text: "Hey, how are you?",
      createdAt: new Date(),
    },
    {
      _id: "m2",
      senderId: "user2",
      text: "I'm good, thanks! You?",
      createdAt: new Date(),
    },
    {
      _id: "m3",
      senderId: "user1",
      text: "Doing great!",
      image: "https://via.placeholder.com/150",
      createdAt: new Date(),
    },
  ];

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic
                      : selectedUser.profilePic
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
