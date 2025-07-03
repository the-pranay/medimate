import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock conversations data
let conversations = [
  {
    id: '1',
    participants: ['1', '2'], // patient ID, doctor ID
    patient: {
      id: '1',
      name: 'John Doe',
      avatar: '/api/placeholder/40/40',
    },
    doctor: {
      id: '2',
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiologist',
      avatar: '/api/placeholder/40/40',
      online: true,
    },
    lastMessage: {
      text: 'Thank you for the prescription. When should I schedule the follow-up?',
      timestamp: '2025-01-01T15:30:00.000Z',
      senderId: '1',
    },
    unreadCount: 2,
    createdAt: '2024-12-28T10:00:00.000Z',
  },
  {
    id: '2',
    participants: ['1', '3'],
    patient: {
      id: '1',
      name: 'John Doe',
      avatar: '/api/placeholder/40/40',
    },
    doctor: {
      id: '3',
      name: 'Dr. Priya Sharma',
      specialization: 'Pediatrician',
      avatar: '/api/placeholder/40/40',
      online: false,
    },
    lastMessage: {
      text: 'The blood test results look normal. Continue the current medication.',
      timestamp: '2024-12-30T14:20:00.000Z',
      senderId: '3',
    },
    unreadCount: 0,
    createdAt: '2024-12-25T09:15:00.000Z',
  },
];

// Mock messages data
let messages = {
  '1': [
    {
      id: '1',
      conversationId: '1',
      senderId: '2',
      senderName: 'Dr. Sarah Wilson',
      text: 'Hello John! I hope you are feeling better today.',
      timestamp: '2025-01-01T14:00:00.000Z',
      type: 'text',
      read: true,
    },
    {
      id: '2',
      conversationId: '1',
      senderId: '1',
      senderName: 'John Doe',
      text: 'Yes, much better! The medication is working well.',
      timestamp: '2025-01-01T14:05:00.000Z',
      type: 'text',
      read: true,
    },
    {
      id: '3',
      conversationId: '1',
      senderId: '2',
      senderName: 'Dr. Sarah Wilson',
      text: 'That\'s great to hear! I\'ve sent your prescription to the pharmacy.',
      timestamp: '2025-01-01T14:10:00.000Z',
      type: 'text',
      read: true,
    },
    {
      id: '4',
      conversationId: '1',
      senderId: '1',
      senderName: 'John Doe',
      text: 'Thank you for the prescription. When should I schedule the follow-up?',
      timestamp: '2025-01-01T15:30:00.000Z',
      type: 'text',
      read: false,
    },
  ],
  '2': [
    {
      id: '5',
      conversationId: '2',
      senderId: '3',
      senderName: 'Dr. Priya Sharma',
      text: 'I received your blood test results.',
      timestamp: '2024-12-30T14:15:00.000Z',
      type: 'text',
      read: true,
    },
    {
      id: '6',
      conversationId: '2',
      senderId: '3',
      senderName: 'Dr. Priya Sharma',
      text: 'The blood test results look normal. Continue the current medication.',
      timestamp: '2024-12-30T14:20:00.000Z',
      type: 'text',
      read: true,
    },
  ],
};

// Helper function to verify JWT token
const verifyToken = (authorization) => {
  if (!authorization) return null;
  
  const token = authorization.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  } catch (error) {
    return null;
  }
};

export async function GET(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Filter conversations based on user role and ID
    const userConversations = conversations.filter(conv => 
      conv.participants.includes(decoded.userId)
    );

    return NextResponse.json({
      success: true,
      data: userConversations,
      total: userConversations.length,
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
