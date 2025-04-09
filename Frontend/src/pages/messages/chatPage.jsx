import ChatContainer from "components/messages/ChatContainer";
import NoChatSelected from "components/messages/NoChatSelected";
import Sidebar from "components/messages/Sidebar";
import { useChatStore } from "store/useChatStore";


const ChatPage = () => {
  const { selectedUser } = useChatStore(); // Get the selected user

  return (
    <div className="h-screen bg-base-200">
      {/* Center the content with padding and flexbox */}
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar - always present */}
            <Sidebar />

            {/* Conditional rendering based on selected user */}
            {!selectedUser ? (
              <NoChatSelected /> // Show when no user is selected
            ) : (
              <ChatContainer /> // Show the chat interface when a user is selected
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
