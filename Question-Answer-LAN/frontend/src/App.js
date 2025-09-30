import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('');
    const [serverIP, setServerIP] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (serverIP) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 1000);
            return () => clearInterval(interval);
        }
    }, [serverIP]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://${serverIP}:5000/api/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleConnect = (e) => {
        e.preventDefault();
        if (username.trim() && serverIP.trim()) {
            setIsConnected(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            try {
                await axios.post(`http://${serverIP}:5000/api/messages`, {
                    username,
                    message: newMessage,
                });
                setNewMessage('');
                fetchMessages();
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const copyMessage = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert('Message copied to clipboard!');
                })
                .catch((err) => {
                    console.error('Failed to copy message:', err);
                });
        } else {
            // Fallback for unsupported browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed'; // Prevents scrolling
            textArea.style.opacity = '0'; // Make it invisible
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    alert('Message copied to clipboard!');
                } else {
                    alert('Failed to copy message!');
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        }
    };

    if (!isConnected) {
        return (
            <div className="connect-container">
                <form onSubmit={handleConnect}>
                    <h2>Join Chat</h2>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter host IP address"
                        value={serverIP}
                        onChange={(e) => setServerIP(e.target.value)}
                        required
                    />
                    <button type="submit">Connect</button>
                </form>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>LAN Chat</h2>
                <span>Connected as: {username}</span>
            </div>

            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.username === username ? 'my-message' : 'other-message'}`}
                        onClick={() => copyMessage(msg.message)}
                    >
                        <div className="message-header">
                            <strong>{msg.username}</strong>
                            <small>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Now'}</small>
                        </div>
                        <p>{msg.message}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="message-form">
                <textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default App;
