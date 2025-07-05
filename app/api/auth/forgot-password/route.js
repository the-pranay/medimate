import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent you a password reset link'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // In a real application, you would send an email here
    // For now, we'll just log the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('Password reset URL:', resetUrl);
    console.log('Reset token for user:', email, 'Token:', resetToken);

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'Password reset link has been sent to your email',
      // Remove this in production - only for development
      devResetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
