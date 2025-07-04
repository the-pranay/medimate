import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Message from '../../../../lib/models/Message';
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
    const conversations = await Message.aggregate([
      {
        $match: {
          participants: decoded.userId
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participantDetails'
        }
      },
      {
        $addFields: {
          lastMessage: {
            $arrayElemAt: ['$messages', -1]
          },
          unreadCount: {
            $size: {
              $filter: {
                input: '$messages',
                cond: {
                  $and: [
                    { $ne: ['$$this.sender', new mongoose.Types.ObjectId(decoded.userId)] },
                    { $eq: ['$$this.read', false] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      }
    ]);

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

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return NextResponse.json(
        { success: false, message: 'Participant not found' },
        { status: 404 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await Message.findOne({
      participants: { $all: [decoded.userId, participantId] }
    });

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        message: 'Conversation already exists',
        data: existingConversation,
      });
    }

    // Create new conversation
    const newConversation = new Message({
      participants: [decoded.userId, participantId],
      messages: initialMessage ? [{
        sender: decoded.userId,
        content: initialMessage,
        timestamp: new Date(),
        read: false
      }] : []
    });

    await newConversation.save();

    // Populate participant details
    await newConversation.populate('participants', 'name email role specialization');

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
