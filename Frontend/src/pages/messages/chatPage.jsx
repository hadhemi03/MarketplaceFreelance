import { useParams } from "react-router-dom";


const ChatPage = () => {
  const { projectId, userId } = useParams(); // userId = other person (receiver)

  return (
    <div>
      <h2>Project Chat</h2>

    </div>
  );
};

export default ChatPage;
