import axios from 'axios'; // Add this import
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BACKEND_URL = 'https://sumithra-social-media-app-2.onrender.com';  // Your backend URL

const ChatPage = () => {
  const { id } = useParams(); // chat partner's id or conversation id
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/messages/${id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Optimistic UI update (add message immediately)
    const tempMessage = { id: Date.now(), sender: 'me', text: newMessage };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');

    try {
      await axios.post(`${BACKEND_URL}/messages`, {
        recipient: id,
        text: newMessage,
      });
      // Optionally, re-fetch messages or update state with server response
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally revert UI update or show error message
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4 border rounded">
      <div className="flex-grow overflow-auto mb-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded max-w-xs ${
                msg.sender === 'me' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200'
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border rounded px-3 py-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
