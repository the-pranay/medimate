import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import MedicalReport from '../../../../lib/models/MedicalReport';
import User from '../../../../lib/models/User';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

// POST - Upload medical report
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

    // Only patients can upload their own reports
    if (decoded.role !== 'patient') {
      return NextResponse.json(
        { success: false, message: 'Only patients can upload medical reports' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');
    const description = formData.get('description');
    const reportDate = formData.get('reportDate');
    const doctor = formData.get('doctor');
    const notes = formData.get('notes');

    // Validate required fields
    if (!file || !type || !description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: file, type, and description' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'medical-reports');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const filename = `${decoded.userId}_${timestamp}${extension}`;
    const filepath = path.join(uploadDir, filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Map report type to enum values
    const typeMapping = {
      'blood-test': 'Blood Test',
      'x-ray': 'X-Ray',
      'mri': 'MRI',
      'ct-scan': 'CT Scan',
      'ultrasound': 'Other',
      'prescription': 'Prescription',
      'consultation': 'Other',
      'other': 'Other'
    };

    // Create medical report record
    const newReport = new MedicalReport({
      patient: decoded.userId,
      doctor: null, // Will be assigned later when shared with a doctor
      title: description,
      type: typeMapping[type] || 'Other',
      description: description,
      findings: notes || '',
      recommendations: '',
      files: [{
        fileName: originalName,
        fileUrl: `/uploads/medical-reports/${filename}`,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: new Date()
      }],
      status: 'available',
      isShared: false,
      createdAt: reportDate ? new Date(reportDate) : new Date(),
      updatedAt: new Date()
    });

    await newReport.save();

    // Populate patient data for response
    await newReport.populate('patient', 'name email phone');

    return NextResponse.json({
      success: true,
      message: 'Medical report uploaded successfully',
      data: {
        id: newReport._id,
        title: newReport.title,
        type: newReport.type,
        description: newReport.description,
        files: newReport.files,
        createdAt: newReport.createdAt,
        patient: newReport.patient
      }
    });

  } catch (error) {
    console.error('Upload medical report error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
