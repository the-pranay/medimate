import { NextResponse } from 'next/server';

// Mock doctors data
const doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    experience: 8,
    rating: 4.8,
    reviews: 124,
    location: 'Mumbai Central Hospital',
    image: '/api/placeholder/80/80',
    availability: 'Available today',
    consultationFee: 800,
    qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
    languages: ['English', 'Hindi', 'Marathi'],
    about: 'Experienced cardiologist specializing in preventive cardiology and heart disease management.',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Dermatologist',
    experience: 6,
    rating: 4.7,
    reviews: 98,
    location: 'Skin Care Clinic',
    image: '/api/placeholder/80/80',
    availability: 'Available tomorrow',
    consultationFee: 600,
    qualifications: ['MBBS', 'MD Dermatology'],
    languages: ['English', 'Hindi'],
    about: 'Specialist in medical and cosmetic dermatology with focus on skin cancer prevention.',
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    experience: 10,
    rating: 4.9,
    reviews: 156,
    location: 'Children\'s Hospital',
    image: '/api/placeholder/80/80',
    availability: 'Available now',
    consultationFee: 700,
    qualifications: ['MBBS', 'MD Pediatrics', 'IAP Fellowship'],
    languages: ['English', 'Hindi', 'Gujarati'],
    about: 'Child health specialist with expertise in newborn care and pediatric infectious diseases.',
  },
  {
    id: '4',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Orthopedist',
    experience: 12,
    rating: 4.6,
    reviews: 203,
    location: 'Bone & Joint Clinic',
    image: '/api/placeholder/80/80',
    availability: 'Available today',
    consultationFee: 900,
    qualifications: ['MBBS', 'MS Orthopedics', 'Fellowship in Sports Medicine'],
    languages: ['English', 'Hindi', 'Telugu'],
    about: 'Orthopedic surgeon specializing in sports injuries and joint replacement surgeries.',
  },
  {
    id: '5',
    name: 'Dr. Neha Gupta',
    specialization: 'Gynecologist',
    experience: 9,
    rating: 4.8,
    reviews: 167,
    location: 'Women\'s Health Center',
    image: '/api/placeholder/80/80',
    availability: 'Available tomorrow',
    consultationFee: 750,
    qualifications: ['MBBS', 'MS Gynecology', 'DGO'],
    languages: ['English', 'Hindi', 'Punjabi'],
    about: 'Women\'s health specialist with expertise in high-risk pregnancies and minimally invasive surgery.',
  },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const location = searchParams.get('location');
    const availability = searchParams.get('availability');
    const search = searchParams.get('search');

    let filteredDoctors = doctors;

    // Filter by specialization
    if (specialization && specialization !== 'all') {
      filteredDoctors = filteredDoctors.filter(
        doctor => doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    // Filter by location
    if (location) {
      filteredDoctors = filteredDoctors.filter(
        doctor => doctor.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by availability
    if (availability) {
      filteredDoctors = filteredDoctors.filter(
        doctor => doctor.availability.toLowerCase().includes(availability.toLowerCase())
      );
    }

    // Search by name or specialization
    if (search) {
      filteredDoctors = filteredDoctors.filter(
        doctor => 
          doctor.name.toLowerCase().includes(search.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredDoctors,
      total: filteredDoctors.length,
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
