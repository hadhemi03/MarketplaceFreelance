import { useParams } from "react-router-dom";
import ChatBox from "../../components/ChatBox.jsx";

const ChatPage = () => {
  const { projectId, userId } = useParams(); // userId = other person (receiver)

  return (
    <div>
      <h2>Project Chat</h2>
      <ChatBox projectId={projectId} receiverId={userId} />
    </div>
  );
};

export default ChatPage;
