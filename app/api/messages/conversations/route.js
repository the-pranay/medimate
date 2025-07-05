import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Message, { Conversation } from '../../../../lib/models/Message';
import User from '../../../../lib/models/User';
import mongoose from 'mongoose';

// Simple conversation system using a single collection
// For demo purposes, we'll use a simple structure

const demoConversations = [
  {
    id: '1',
    participants: ['patient1', 'doctor1'],
    doctor: { name: 'Dr. John Smith', specialization: 'Cardiology', online: true },
    lastMessage: { text: 'How are you feeling today?', time: '2 hours ago', sender: 'doctor' },
    unreadCount: 0,
    messages: [
      {
        id: '1',
        text: 'Hello Doctor, I need help with my chest pain.',
        time: '2024-01-01T10:00:00.000Z',
        sender: 'patient',
        senderName: 'John Doe',
        read: true
      },
      {
        id: '2',
        text: 'I understand. Can you describe the pain?',
        time: '2024-01-01T10:05:00.000Z',
        sender: 'doctor',
        senderName: 'Dr. John Smith',
        read: true
      }
    ]
  },
  {
    id: '2',
    participants: ['patient1', 'doctor2'],
    doctor: { name: 'Dr. Sarah Johnson', specialization: 'General Medicine', online: false },
    lastMessage: { text: 'Your test results are ready.', time: '1 day ago', sender: 'doctor' },
    unreadCount: 1,
    messages: [
      {
        id: '3',
        text: 'When will my test results be ready?',
        time: '2024-01-01T08:00:00.000Z',
        sender: 'patient',
        senderName: 'John Doe',
        read: true
      },
      {
        id: '4',
        text: 'Your test results are ready. Please check your reports.',
        time: '2024-01-01T14:00:00.000Z',
        sender: 'doctor',
        senderName: 'Dr. Sarah Johnson',
        read: false
      }
    ]
  }
];

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

// GET conversations
export async function GET(request) {
  try {
    await connectDB();
    
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For demo, return static conversations
    // In production, you would query the database based on user ID
    const conversations = demoConversations.map(conv => ({
      ...conv,
      // Add user-specific data
      _id: conv.id,
      participantDetails: [
        { name: 'Current User', role: decoded.role },
        { name: conv.doctor.name, role: 'doctor' }
      ]
    }));

    return NextResponse.json({
      success: true,
      data: conversations,
      total: conversations.length,
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new conversation
export async function POST(request) {
  try {
    await connectDB();
    
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { participantId, initialMessage } = await request.json();

    if (!participantId) {
      return NextResponse.json(
        { success: false, message: 'Participant ID is required' },
        { status: 400 }
      );
    }

    // For demo, create a new conversation
    const newConversation = {
      _id: 'conv_' + Date.now(),
      participants: [decoded.userId, participantId],
      messages: initialMessage ? [{
        id: 'msg_' + Date.now(),
        text: initialMessage,
        time: new Date().toISOString(),
        sender: decoded.role,
        senderName: decoded.name || 'User',
        read: false
      }] : [],
      doctor: {
        name: 'Dr. Demo',
        specialization: 'General Medicine',
        online: true
      },
      lastMessage: initialMessage ? {
        text: initialMessage,
        time: 'Just now',
        sender: decoded.role
      } : null,
      unreadCount: 0
    };

    return NextResponse.json({
      success: true,
      message: 'Conversation created successfully',
      data: newConversation,
    });

  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
