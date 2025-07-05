import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Message, { Conversation } from '../../../../lib/models/Message';
import User from '../../../../lib/models/User';
import mongoose from 'mongoose';

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

    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      'participants.user': decoded.userId,
      isActive: true
    })
    .populate('participants.user', 'name email role specialization')
    .populate('lastMessage', 'content messageType createdAt')
    .sort({ updatedAt: -1 });

    // Get unread message counts for each conversation
    const conversationData = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          recipient: decoded.userId,
          isRead: false
        });

        const otherParticipant = conv.participants.find(
          p => p.user._id.toString() !== decoded.userId
        );

        return {
          _id: conv._id,
          participants: conv.participants,
          otherParticipant: otherParticipant?.user || null,
          lastMessage: conv.lastMessage,
          unreadCount,
          updatedAt: conv.updatedAt,
          createdAt: conv.createdAt
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: conversationData,
      total: conversationData.length,
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

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return NextResponse.json(
        { success: false, message: 'Participant not found' },
        { status: 404 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      'participants.user': { $all: [decoded.userId, participantId] },
      isActive: true
    });

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        message: 'Conversation already exists',
        data: existingConversation,
      });
    }

    // Create new conversation
    const newConversation = new Conversation({
      participants: [
        { user: decoded.userId, role: decoded.role },
        { user: participantId, role: participant.role }
      ],
      isActive: true
    });

    await newConversation.save();

    // Send initial message if provided
    if (initialMessage) {
      const message = new Message({
        sender: decoded.userId,
        recipient: participantId,
        conversation: newConversation._id,
        content: initialMessage,
        messageType: 'text'
      });

      await message.save();
      newConversation.lastMessage = message._id;
      await newConversation.save();
    }

    // Populate for response
    await newConversation.populate('participants.user', 'name email role specialization');
    await newConversation.populate('lastMessage', 'content messageType createdAt');

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
