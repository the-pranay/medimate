import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import Message from '../../../lib/models/Message';
import User from '../../../lib/models/User';

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

// GET messages for a user
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

    const { searchParams } = new URL(request.url);
    const conversationWith = searchParams.get('conversationWith');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let query = {};
    
    if (conversationWith) {
      // Get specific conversation
      query = {
        $or: [
          { sender: decoded.userId, receiver: conversationWith },
          { sender: conversationWith, receiver: decoded.userId }
        ]
      };
    } else {
      // Get all messages for the user
      query = {
        $or: [
          { sender: decoded.userId },
          { receiver: decoded.userId }
        ]
      };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email profilePicture role')
      .populate('receiver', 'name email profilePicture role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total: totalMessages,
          pages: Math.ceil(totalMessages / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Send a new message
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

    const { receiverId, content, messageType = 'text' } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, message: 'Receiver ID and content are required' },
        { status: 400 }
      );
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { success: false, message: 'Receiver not found' },
        { status: 404 }
      );
    }

    // Create new message
    const message = await Message.create({
      sender: decoded.userId,
      receiver: receiverId,
      content,
      messageType,
      isRead: false
    });

    // Populate the message with sender and receiver info
    await message.populate('sender', 'name email profilePicture role');
    await message.populate('receiver', 'name email profilePicture role');

    return NextResponse.json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Mark messages as read
export async function PATCH(request) {
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

    const { messageIds, conversationWith } = await request.json();

    let updateQuery = {};
    
    if (messageIds && messageIds.length > 0) {
      updateQuery = {
        _id: { $in: messageIds },
        receiver: decoded.userId
      };
    } else if (conversationWith) {
      updateQuery = {
        sender: conversationWith,
        receiver: decoded.userId,
        isRead: false
      };
    } else {
      return NextResponse.json(
        { success: false, message: 'Message IDs or conversation partner required' },
        { status: 400 }
      );
    }

    const result = await Message.updateMany(
      updateQuery,
      { isRead: true, readAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Mark messages as read error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
