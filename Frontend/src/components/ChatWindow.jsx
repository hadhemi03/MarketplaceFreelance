import React, { useEffect, useRef } from "react";
import '../pages/messages/ChatPage.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatWindow = ({ messages, selectedUser, currentUserId }) => {
    const messageEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedUser]); // also scroll when switching users

    return (
        <div className="px-4 py-5 chat-box bg-white" style={{ height: "65vh", overflowY: "auto" }}>
            {messages.length === 0 ? (
                <p className="text-center text-muted">Select a user to start chatting</p>
            ) : (
                messages.map((message, index) => (
                    <div key={index} className={`d-flex mb-3 ${message.senderId === currentUserId ? "justify-content-end" : "justify-content-start"
                        }`}>
                        <div className={`rounded-3 p-3 ${message.senderId === currentUserId ? "bg-primary text-white" : "bg-secondary text-white"
                            }`} style={{ maxWidth: "75%" }}>
                            {message.text}
                        </div>
                    </div>
                ))
            )}

            <div ref={messageEndRef} />

        </div>

    );
};

export default ChatWindow;
