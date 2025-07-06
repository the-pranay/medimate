import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const envVars = {
      agoraAppId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      nodeEnv: process.env.NODE_ENV,
      // Add debug info
      agoraAppIdServer: process.env.AGORA_APP_ID,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('AGORA')),
    };

    return NextResponse.json({
      success: true,
      ...envVars,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
