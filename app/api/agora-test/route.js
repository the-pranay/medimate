import { NextResponse } from 'next/server';
import { checkAgoraConfig } from '../../../lib/envValidator';

export async function GET(request) {
  try {
    const config = checkAgoraConfig();
    
    return NextResponse.json({
      success: true,
      ...config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
