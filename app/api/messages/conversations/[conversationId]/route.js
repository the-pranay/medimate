import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Import messages data from conversations route
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

export async function GET(request, { params }) {
  try {
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversationId = params.conversationId;
    const conversationMessages = messages[conversationId] || [];

    return NextResponse.json({
      success: true,
      data: conversationMessages,
      total: conversationMessages.length,
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversationId = params.conversationId;
    const { text, type = 'text' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, message: 'Message text is required' },
        { status: 400 }
      );
    }

    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      conversationId,
      senderId: decoded.userId,
      senderName: decoded.name || 'User',
      text,
      timestamp: new Date().toISOString(),
      type,
      read: false,
    };

    // Add message to conversation
    if (!messages[conversationId]) {
      messages[conversationId] = [];
    }
    messages[conversationId].push(newMessage);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
