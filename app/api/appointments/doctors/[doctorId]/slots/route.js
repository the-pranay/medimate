import { NextResponse } from 'next/server';
import connectDB from '../../../../../../lib/mongodb';
import Appointment from '../../../../../../lib/models/Appointment';
import User from '../../../../../../lib/models/User';

// Generate time slots for a doctor
const generateTimeSlots = (date, bookedSlots = []) => {
  const slots = [];
  const morningSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const eveningSlots = ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'];
  
  // Add morning slots
  morningSlots.forEach(time => {
    slots.push({
      time,
      available: !bookedSlots.includes(time),
      type: 'morning'
    });
  });
  
  // Add evening slots
  eveningSlots.forEach(time => {
    slots.push({
      time,
      available: !bookedSlots.includes(time),
      type: 'evening'
    });
  });
  
  return slots;
};

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const doctorId = params.doctorId;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Get existing appointments for this doctor on this date
    const existingAppointments = await Appointment.find({
      doctorId,
      appointmentDate: date
    });

    // Extract booked time slots
    const bookedSlots = existingAppointments.map(appointment => appointment.appointmentTime);

    // Generate available slots for the requested date
    const slots = generateTimeSlots(date, bookedSlots);

    return NextResponse.json({
      success: true,
      data: {
        doctorId,
        date,
        slots,
      },
    });

  } catch (error) {
    console.error('Get doctor slots error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
