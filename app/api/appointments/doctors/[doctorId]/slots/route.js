import { NextResponse } from 'next/server';

// Mock appointments data
let appointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    doctorName: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    date: '2025-01-02',
    time: '10:00 AM',
    type: 'Consultation',
    status: 'confirmed',
    notes: 'Follow-up for hypertension',
    consultationFee: 800,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '3',
    doctorName: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    date: '2025-01-05',
    time: '2:00 PM',
    type: 'Regular Checkup',
    status: 'pending',
    notes: 'Child vaccination appointment',
    consultationFee: 700,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
];

// Generate time slots for a doctor
const generateTimeSlots = (date) => {
  const slots = [];
  const morningSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const eveningSlots = ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'];
  
  // Add morning slots
  morningSlots.forEach(time => {
    slots.push({
      time,
      available: Math.random() > 0.3, // 70% chance of being available
      type: 'morning'
    });
  });
  
  // Add evening slots
  eveningSlots.forEach(time => {
    slots.push({
      time,
      available: Math.random() > 0.3, // 70% chance of being available
      type: 'evening'
    });
  });
  
  return slots;
};

export async function GET(request, { params }) {
  try {
    const doctorId = params.doctorId;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Generate available slots for the requested date
    const slots = generateTimeSlots(date);

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
