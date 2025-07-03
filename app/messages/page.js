'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Send, 
  ArrowLeft,
  User,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

export default function Messages() {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [conversations, setConversations] = useState([
    {
      id: 1,
      doctor: {
        name: 'Dr. Sarah Wilson',
        specialization: 'Cardiologist',
        avatar: null,
        online: true
      },
      lastMessage: {
        text: 'Your blood test results are normal. Continue with the prescribed medication.',
        time: '2 hours ago',
        sender: 'doctor'
      },
      unreadCount: 2,
      messages: [
        {
          id: 1,
          text: 'Hello Dr. Wilson, I have received my blood test results.',
          time: '2025-06-25T10:30:00Z',
          sender: 'patient'
        },
        {
          id: 2,
          text: 'Thank you for uploading the results. Let me review them.',
          time: '2025-06-25T10:45:00Z',
          sender: 'doctor'
        },
        {
          id: 3,
          text: 'Your blood test results are normal. Continue with the prescribed medication.',
          time: '2025-06-25T11:00:00Z',
          sender: 'doctor'
        },
        {
          id: 4,
          text: 'Should I continue with the same dosage?',
          time: '2025-06-25T11:15:00Z',
          sender: 'patient'
        },
        {
          id: 5,
          text: 'Yes, continue with the same dosage. We will monitor your progress in the next appointment.',
          time: '2025-06-25T11:30:00Z',
          sender: 'doctor'
        }
      ]
    },
    {
      id: 2,
      doctor: {
        name: 'Dr. Michael Chen',
        specialization: 'Dermatologist',
        avatar: null,
        online: false
      },
      lastMessage: {
        text: 'Please apply the prescribed cream twice daily.',
        time: '1 day ago',
        sender: 'doctor'
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          text: 'Doctor, I have some concerns about the skin condition.',
          time: '2025-06-24T14:20:00Z',
          sender: 'patient'
        },
        {
          id: 2,
          text: 'Please describe the symptoms you are experiencing.',
          time: '2025-06-24T14:35:00Z',
          sender: 'doctor'
        },
        {
          id: 3,
          text: 'The redness has increased and there is some itching.',
          time: '2025-06-24T14:40:00Z',
          sender: 'patient'
        },
        {
          id: 4,
          text: 'Please apply the prescribed cream twice daily and avoid direct sunlight. If symptoms persist, please schedule an appointment.',
          time: '2025-06-24T15:00:00Z',
          sender: 'doctor'
        }
      ]
    },
    {
      id: 3,
      doctor: {
        name: 'Dr. Priya Sharma',
        specialization: 'Pediatrician',
        avatar: null,
        online: true
      },
      lastMessage: {
        text: 'The vaccination schedule looks good.',
        time: '3 days ago',
        sender: 'doctor'
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          text: 'Hello Dr. Sharma, I wanted to discuss the vaccination schedule for my child.',
          time: '2025-06-22T09:15:00Z',
          sender: 'patient'
        },
        {
          id: 2,
          text: 'Of course! How old is your child and what vaccines are you concerned about?',
          time: '2025-06-22T09:30:00Z',
          sender: 'doctor'
        },
        {
          id: 3,
          text: 'My child is 2 years old. I want to make sure we are on track with all vaccinations.',
          time: '2025-06-22T09:35:00Z',
          sender: 'patient'
        },
        {
          id: 4,
          text: 'The vaccination schedule looks good. Please bring the vaccination card in the next appointment for review.',
          time: '2025-06-22T09:45:00Z',
          sender: 'doctor'
        }
      ]
    }
  ]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: selectedChat.messages.length + 1,
      text: newMessage.trim(),
      time: new Date().toISOString(),
      sender: 'patient'
    };

    const updatedConversations = conversations.map(conv =>
      conv.id === selectedChat.id
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: {
              text: message.text,
              time: 'Just now',
              sender: 'patient'
            }
          }
        : conv
    );

    setConversations(updatedConversations);
    
    // Update selected chat
    const updatedSelectedChat = updatedConversations.find(conv => conv.id === selectedChat.id);
    setSelectedChat(updatedSelectedChat);
    
    setNewMessage('');
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timeString) => {
    const date = new Date(timeString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const totalUnreadMessages = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col pt-8">
        <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="flex-shrink-0 w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      {conversation.doctor.online && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.doctor.name}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.doctor.specialization}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {conversation.lastMessage.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conversation.lastMessage.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      {selectedChat.doctor.online && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedChat.doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedChat.doctor.specialization} • {selectedChat.doctor.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((message, index) => {
                  const isNewDay = index === 0 || 
                    formatDate(message.time) !== formatDate(selectedChat.messages[index - 1]?.time);
                  
                  return (
                    <div key={message.id}>
                      {isNewDay && (
                        <div className="flex justify-center mb-4">
                          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {formatDate(message.time)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'patient'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a doctor from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
  );
}
