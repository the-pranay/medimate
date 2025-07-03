import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock medical reports data
let medicalReports = [
  {
    id: '1',
    patientId: '1',
    title: 'Blood Test Report',
    type: 'Lab Report',
    doctor: 'Dr. Sarah Wilson',
    date: '2024-12-15',
    category: 'Blood Test',
    status: 'completed',
    description: 'Complete blood count and lipid profile',
    fileUrl: '/mock-reports/blood-test-1.pdf',
    findings: ['Cholesterol: 180 mg/dL (Normal)', 'Hemoglobin: 14.2 g/dL (Normal)', 'Blood Sugar: 95 mg/dL (Normal)'],
    recommendations: ['Continue current diet', 'Regular exercise recommended'],
    createdAt: '2024-12-15T10:30:00.000Z',
  },
  {
    id: '2',
    patientId: '1',
    title: 'Chest X-Ray Report',
    type: 'Imaging',
    doctor: 'Dr. Michael Chen',
    date: '2024-12-10',
    category: 'X-Ray',
    status: 'completed',
    description: 'Chest X-ray examination for respiratory assessment',
    fileUrl: '/mock-reports/chest-xray-1.pdf',
    findings: ['Clear lung fields', 'Normal heart size', 'No abnormal shadows'],
    recommendations: ['No immediate action required', 'Follow-up in 6 months'],
    createdAt: '2024-12-10T14:20:00.000Z',
  },
  {
    id: '3',
    patientId: '1',
    title: 'ECG Report',
    type: 'Cardiac Test',
    doctor: 'Dr. Sarah Wilson',
    date: '2024-12-05',
    category: 'ECG',
    status: 'completed',
    description: 'Electrocardiogram for cardiac rhythm assessment',
    fileUrl: '/mock-reports/ecg-1.pdf',
    findings: ['Normal sinus rhythm', 'Rate: 72 bpm', 'No ST changes'],
    recommendations: ['Continue cardiac medications', 'Regular monitoring'],
    createdAt: '2024-12-05T09:15:00.000Z',
  },
];

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

export async function GET(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const doctor = searchParams.get('doctor');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let userReports = medicalReports;

    // Filter by user role and ID
    if (decoded.role === 'patient') {
      userReports = medicalReports.filter(report => report.patientId === decoded.userId);
    } else if (decoded.role === 'doctor') {
      userReports = medicalReports.filter(report => report.doctor.includes(decoded.userId));
    }

    // Apply filters
    if (category) {
      userReports = userReports.filter(report => 
        report.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (doctor) {
      userReports = userReports.filter(report => 
        report.doctor.toLowerCase().includes(doctor.toLowerCase())
      );
    }

    if (startDate) {
      userReports = userReports.filter(report => 
        new Date(report.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      userReports = userReports.filter(report => 
        new Date(report.date) <= new Date(endDate)
      );
    }

    return NextResponse.json({
      success: true,
      data: userReports,
      total: userReports.length,
    });

  } catch (error) {
    console.error('Get medical reports error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const decoded = verifyToken(authorization);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title');
    const type = formData.get('type');
    const category = formData.get('category');
    const description = formData.get('description');
    const doctor = formData.get('doctor') || 'Self-uploaded';
    const file = formData.get('file');

    if (!title || !type || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate file type and size
    // 2. Upload file to cloud storage (AWS S3, Cloudinary, etc.)
    // 3. Store file metadata in database
    // 4. Scan for sensitive data and encrypt if needed

    const newReport = {
      id: Date.now().toString(),
      patientId: decoded.userId,
      title,
      type,
      category,
      description: description || '',
      doctor,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      fileUrl: file ? `/uploads/${file.name}` : null,
      findings: [],
      recommendations: [],
      createdAt: new Date().toISOString(),
    };

    medicalReports.push(newReport);

    return NextResponse.json({
      success: true,
      message: 'Medical report uploaded successfully',
      data: newReport,
    });

  } catch (error) {
    console.error('Upload medical report error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
