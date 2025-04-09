import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-100 d-flex align-items-center justify-content-center p-5 bg-light">
      <div className="text-center">
        <div className="d-flex justify-content-center mb-4">
          <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary p-4">
            <MessageSquare className="text-white" size={24} />
          </div>
        </div>
        <p className="text-muted">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
