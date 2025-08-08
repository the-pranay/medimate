'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../../components/ui/DashboardNavbar';
import { MessageCircle, Send, Search, User, Clock, Plus, X, Circle } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export default function DoctorMessages() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const refreshInterval = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user');

      if (!token || userRole !== 'doctor') {
        router.push('/login');
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    checkAuth();
    loadConversations();
    loadPatients();
    initializeSocket();
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, [router]);

  // Socket.IO initialization
  const initializeSocket = () => {
    const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'https://medimate-socket-server.onrender.com';
    const newSocket = io(socketServerUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      if (user) {
        newSocket.emit('user-online', { userId: user.id, role: 'doctor' });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    newSocket.on('new-message', (message) => {
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      loadConversations(); // Update conversation list
    });

    newSocket.on('users-online', (users) => {
      setOnlineUsers(new Set(users));
    });

    newSocket.on('user-joined', (userId) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    });

    newSocket.on('user-left', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    setSocket(newSocket);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
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
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/users/patients', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data.users || []);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const startNewConversation = async (patient) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: patient._id,
          content: `Hello ${patient.name}, I'm reaching out to discuss your health consultation.`,
        }),
      });

      if (response.ok) {
        setShowPatientSelector(false);
        loadConversations();
        // Auto-select the new conversation
        setTimeout(() => {
          const newConv = conversations.find(c => c.patient._id === patient._id);
          if (newConv) {
            setSelectedConversation(newConv);
            loadMessages(newConv._id);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`/api/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedConversation.patient._id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewMessage('');
        
        // Emit real-time message if socket is connected
        if (socket && isConnected) {
          socket.emit('send-message', {
            conversationId: selectedConversation._id,
            senderId: user.id,
            receiverId: selectedConversation.patient._id,
            content: newMessage,
            timestamp: new Date().toISOString()
          });
        }
        
        loadMessages(selectedConversation._id);
        toast.success('Message sent!');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar user={user} userRole="doctor" onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar user={user} userRole="doctor" onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">Communicate with your patients</p>
            </div>
            <button
              onClick={() => setShowPatientSelector(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
              
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">Click "New Conversation" to start messaging patients</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {conversations.filter(conv => 
                    conv.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        loadMessages(conversation._id);
                      }}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 flex items-center">
                          {conversation.patient?.name || 'Unknown Patient'}
                          {onlineUsers.has(conversation.patient?._id) && (
                            <Circle className="w-2 h-2 text-green-500 fill-current ml-2" />
                          )}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage || 'No messages yet'}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      {selectedConversation.patient?.name || 'Unknown Patient'}
                      {onlineUsers.has(selectedConversation.patient?._id) && (
                        <Circle className="w-2 h-2 text-green-500 fill-current ml-2" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Patient {onlineUsers.has(selectedConversation.patient?._id) ? '• Online' : '• Offline'}
                    </p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                    <p className="text-gray-400 text-sm mt-2">Or click "New Conversation" to message a patient</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient Selector Modal */}
        {showPatientSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Patient</h3>
                <button
                  onClick={() => setShowPatientSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {patients.filter(patient => 
                  patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((patient) => (
                  <div
                    key={patient._id}
                    onClick={() => startNewConversation(patient)}
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 flex items-center">
                        {patient.name}
                        {onlineUsers.has(patient._id) && (
                          <Circle className="w-2 h-2 text-green-500 fill-current ml-2" />
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                      {patient.phone && (
                        <p className="text-xs text-gray-400">{patient.phone}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {patients.filter(patient => 
                  patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-8">
                    <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No patients found</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Circle className={`w-2 h-2 mr-2 ${isConnected ? 'text-green-500 fill-current' : 'text-red-500 fill-current'}`} />
                  {isConnected ? 'Connected' : 'Disconnected'} - Real-time messaging
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
