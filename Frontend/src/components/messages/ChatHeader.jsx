import { X } from "lucide-react";

const ChatHeader = () => {
  // ✅ Static mock data
  const selectedUser = {
    _id: "user2",
    fullName: "Jane Doe",
    profilePic: "/avatar.png",
  };

  const onlineUsers = ["user1", "user2"]; // Simulate online status

  const handleClose = () => {
    console.log("Close chat (in real app, this resets selectedUser)");
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Avatar and User Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic} alt={selectedUser.fullName} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={handleClose}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
