import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../pages/messages/ChatPage.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = ({ users }) => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole'); 
    const [showModal, setShowModal] = useState(false); // 🔹 Modal state

    const handleSelectUser = (userId) => {
        if (role === 'client') {
            navigate(`/client/messages/${userId}`);
        } else if (role === 'freelancer') {
            navigate(`/freelancer/messages/${userId}`);
        } else {
            console.warn("Unknown role, can't navigate");
        }
    };

    return (
        <div className="col-5 px-0 bg-white">
            <div className="bg-white">
                {/* 🔹 Top section with title and Plus icon */}
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
                    <h6 className="mb-0">Chats</h6>  
                </div>

                {/* 🔹 Chat user list */}
                <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: "80vh" }}>
                    {users.length === 0 ? (
                        <p className="text-center text-muted mt-4">No users to chat with</p>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user._id}
                                className="list-group-item list-group-item-action d-flex align-items-center border-bottom"
                                onClick={() => handleSelectUser(user._id)}
                            >
                                <img
                                    src={`http://localhost:5000${user.img}` || "https://via.placeholder.com/50"}
                                    alt={user.username}
                                    className="rounded-circle me-3"
                                    style={{ width: "40px", height: "40px" }}
                                />
                                <div className="d-flex flex-column">
                                    <strong>{user.username}</strong>
                                    <small className="text-muted">{user.role}</small>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};


export default Sidebar;
