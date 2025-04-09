import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, TextField, Button, Avatar, Divider } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams

const ChatPage = () => {
  const { freelancerId } = useParams();  // Retrieve freelancerId from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationExists, setConversationExists] = useState(false); // Track if conversation exists

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/msg/${freelancerId}`, { withCredentials: true });
        
        if (response.data.length > 0) {
          setMessages(response.data);
          setConversationExists(true);  // Set conversation exists to true if messages are found
        } else {
          setConversationExists(false); // If no messages exist, it's a new conversation
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (freelancerId) {
      fetchMessages();
    }
  }, [freelancerId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // If the conversation doesn't exist, create it
      if (!conversationExists) {
        await axios.post(
          `http://localhost:5000/api/messages/start-conversation/${freelancerId}`,
          { message: newMessage },
          { withCredentials: true }
        );
        setConversationExists(true); // Mark conversation as existing
      } else {
        // If the conversation exists, simply send the message
        await axios.put(
          `http://localhost:5000/api/messages/send/${freelancerId}`,
          { message: newMessage },
          { withCredentials: true }
        );
      }

      // Update messages list after sending the new message
      setMessages([...messages, { message: newMessage, senderId: freelancerId }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box display="flex" sx={{ height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: 300, background: '#f0f2f5', padding: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
          Chat with Freelancer
        </Typography>

        {/* Sidebar content */}
      </Box>

      {/* Chat Window */}
      <Box sx={{ flex: 1, background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ padding: 2, borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ marginRight: 2 }} />
          <Typography variant="h6">Freelancer</Typography>
        </Box>

        <Box sx={{ flex: 1, padding: 2, overflowY: 'auto' }}>
          <Stack spacing={2}>
            {messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Start a conversation with the freelancer...
              </Typography>
            ) : (
              messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    alignSelf: msg.senderId === freelancerId ? 'flex-end' : 'flex-start',
                    background: msg.senderId === freelancerId ? '#4caf50' : '#f0f0f0',
                    color: '#fff',
                    borderRadius: 2,
                    padding: 1,
                    maxWidth: '70%',
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                </Box>
              ))
            )}
          </Stack>
        </Box>

        <Divider sx={{ margin: 2 }} />

        <Box sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            variant="outlined"
            placeholder="Type a message"
            sx={{ marginRight: 2 }}
          />
          <Button onClick={sendMessage} variant="contained" color="primary">
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
