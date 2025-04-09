import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatstore.js";
import SidebarSkeleton from "components/skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const [onlineUsers, setOnlineUsers] = useState([]); // To store online users fetched from localStorage
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();

    // Fetch online users from localStorage (assuming the online users are stored here)
    const storedOnlineUsers = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    setOnlineUsers(storedOnlineUsers);
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-100 w-100 d-flex flex-column border-end">
      <div className="border-bottom p-3">
        <div className="d-flex align-items-center gap-2">
          <Users size={24} />
          <span className="font-weight-bold">Contacts</span>
        </div>
        {/* Online filter toggle */}
        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="onlineOnly"
            checked={showOnlineOnly}
            onChange={() => setShowOnlineOnly(!showOnlineOnly)}
          />
          <label className="form-check-label" htmlFor="onlineOnly">
            Show Online Only
          </label>
        </div>
      </div>

      <div className="overflow-auto">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className={`d-flex align-items-center gap-3 py-2 px-3 cursor-pointer ${selectedUser?._id === user._id ? "bg-primary text-white" : "text-muted"}`}
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.username}
              className="rounded-circle size-10"
            />
            <div className="d-flex flex-column">
              <span className="font-weight-bold">{user.username}</span>
              <span className="text-muted small">{user.online ? "Online" : "Offline"}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
