'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Send, 
  Video, 
  Phone, 
  Plus, 
  Search, 
  User, 
  Circle, 
  CheckCircle, 
  MoreVertical,
  Paperclip,
  Smile,
  X
} from 'lucide-react';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export default function RealTimeMessaging() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Authentication and initial data loading
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token) {
        router.push('/login');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }
      setUserRole(role);
    };

    checkAuth();
    loadConversations();
    
    if (userRole === 'patient') {
      loadDoctors();
    } else if (userRole === 'doctor') {
      loadPatients();
    }
  }, [router, userRole]);

  // Socket.IO initialization
  useEffect(() => {
    if (user && user._id) {
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';
      const socketInstance = io(socketServerUrl);
      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        console.log('Connected to Socket.IO server');
        setIsConnected(true);
        socketInstance.emit('join', user._id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
        setIsConnected(false);
      });

      socketInstance.on('new_message', (data) => {
        console.log('Received new message:', data);
        
        if (selectedConversation && data.conversationId === selectedConversation._id) {
          setMessages(prev => [...prev, {
            _id: Date.now(),
            content: data.message,
            sender: { _id: data.senderId },
            createdAt: data.timestamp
          }]);
        }
        
        loadConversations();
        
        if (!selectedConversation || data.conversationId !== selectedConversation._id) {
          toast.success('New message received!');
        }
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user, selectedConversation]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`/api/messages/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch('/api/appointments/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch('/api/doctor/patients', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([
        { _id: '1', name: 'John Doe', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ]);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation._id);
    setShowNewConversation(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    const tempMessage = {
      _id: 'temp_' + Date.now(),
      content: messageText,
      sender: { _id: user._id },
      createdAt: new Date().toISOString(),
      status: 'sending'
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`/api/messages/conversations/${selectedConversation._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageText,
          messageType: 'text'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
        setMessages(prev => [...prev, data.data]);
        
        if (socket && isConnected) {
          socket.emit('send_message', {
            conversationId: selectedConversation._id,
            senderId: user._id,
            recipientId: selectedConversation.otherParticipant._id,
            message: messageText
          });
        }
        
        loadConversations();
        toast.success('Message sent!');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      setNewMessage(messageText);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const startVideoCall = () => {
    if (selectedConversation) {
      toast.success('Starting video call...');
      router.push(`/video-call?participantId=${selectedConversation.otherParticipant?._id}`);
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messaging service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole={userRole} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-12rem)] flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                <div className="flex items-center space-x-2">
                  <Circle 
                    className={`h-2 w-2 ${isConnected ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} 
                  />
                  <span className="text-xs text-gray-500">
                    {isConnected ? 'Real-time' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start a conversation to begin messaging</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => {
                    const otherParticipant = conversation.otherParticipant;
                    if (!otherParticipant) return null;
                    
                    return (
                      <div
                        key={conversation._id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                          selectedConversation?._id === conversation._id
                            ? 'bg-blue-50 border-blue-500'
                            : 'border-transparent'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {otherParticipant.name || 'Unknown User'}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 truncate">
                              {otherParticipant.specialization || (userRole === 'doctor' ? 'Patient' : 'Healthcare Provider')}
                            </p>
                            
                            {conversation.lastMessage && (
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h2 className="font-medium text-gray-900">
                          {selectedConversation.otherParticipant?.name || 'Unknown User'}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-500">
                            {selectedConversation.otherParticipant?.specialization || (userRole === 'doctor' ? 'Patient' : 'Healthcare Provider')}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Circle 
                              className={`h-2 w-2 ${isConnected ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} 
                            />
                            <span className="text-xs text-gray-500">
                              {isConnected ? 'Real-time' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={startVideoCall}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Start Video Call"
                      >
                        <Video className="h-5 w-5" />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        title="Voice Call"
                      >
                        <Phone className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.sender._id === user?._id;
                    
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                              {formatTime(message.createdAt)}
                              {message.status === 'sending' && ' • Sending...'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={sendMessage} className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(e);
                          }
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendingMessage}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {sendingMessage ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
