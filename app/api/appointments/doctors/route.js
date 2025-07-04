import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';

// GET doctors list
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const location = searchParams.get('location');
    const availability = searchParams.get('availability');
    const rating = searchParams.get('rating');

    let query = { role: 'doctor', isActive: true };

    // Apply filters
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    if (location) {
      query.address = { $regex: location, $options: 'i' };
    }
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const doctors = await User.find(query)
      .select('-password -__v')
      .sort({ rating: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: doctors,
      total: doctors.length,
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

