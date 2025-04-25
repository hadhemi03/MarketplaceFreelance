import { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import axios from 'axios';

const MessageInput = ({ currentUserId }) => {
  const [text, setText] = useState('');
  const { selectedUser, socket, addMessage } = useChatStore();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const message = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text,
    };

    try {
      const res = await axios.post('/messages', message);
      addMessage(res.data);
      socket.emit('sendMessage', message);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="chat-message clearfix">
      <form onSubmit={sendMessage}>
        <div className="input-group mb-0">
          <input
            type="text"
            className="form-control"
            placeholder="Enter text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
