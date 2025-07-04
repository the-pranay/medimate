import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

import connectDB from '../lib/mongodb.js';
import User from '../lib/models/User.js';
import Appointment from '../lib/models/Appointment.js';
import MedicalReport from '../lib/models/MedicalReport.js';
import { Message, Conversation } from '../lib/models/Message.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Debug environment variables
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Not found');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalReport.deleteMany({});
    await Message.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Patients
    const patient1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      phone: '+91 9876543210',
      role: 'patient',
      age: 29,
      gender: 'Male',
      address: 'Mumbai, MH',
      bloodGroup: 'O+',
      medicalHistory: ['Hypertension'],
      allergies: ['Peanuts'],
      isActive: true
    });

    const patient2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      phone: '+91 9876543211',
      role: 'patient',
      age: 34,
      gender: 'Female',
      address: 'Delhi, DL',
      bloodGroup: 'A+',
      isActive: true
    });

    const patient3 = await User.create({
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: hashedPassword,
      phone: '+91 9876543212',
      role: 'patient',
      age: 45,
      gender: 'Male',
      address: 'Bangalore, KA',
      bloodGroup: 'B+',
      isActive: true
    });

    // Create Doctors
    const doctor1 = await User.create({
      name: 'Dr. Sarah Wilson',
      email: 'sarah@medimate.com',
      password: hashedPassword,
      phone: '+91 9876543220',
      role: 'doctor',
      specialization: 'Cardiologist',
      experience: 8,
      licenseNumber: 'MH12345',
      rating: 4.8,
      consultationFee: 800,
      qualification: 'MBBS, MD Cardiology',
      about: 'Experienced cardiologist specializing in preventive cardiology and heart disease management.',
      address: 'Mumbai Central Hospital',
      isActive: true
    });

    const doctor2 = await User.create({
      name: 'Dr. Michael Chen',
      email: 'michael@medimate.com',
      password: hashedPassword,
      phone: '+91 9876543221',
      role: 'doctor',
      specialization: 'Dermatologist',
      experience: 6,
      licenseNumber: 'DL67890',
      rating: 4.7,
      consultationFee: 600,
      qualification: 'MBBS, MD Dermatology',
      about: 'Specialist in medical and cosmetic dermatology with focus on skin cancer prevention.',
      address: 'Skin Care Clinic, Delhi',
      isActive: true
    });

    const doctor3 = await User.create({
      name: 'Dr. Priya Sharma',
      email: 'priya@medimate.com',
      password: hashedPassword,
      phone: '+91 9876543222',
      role: 'doctor',
      specialization: 'Pediatrician',
      experience: 10,
      licenseNumber: 'KA54321',
      rating: 4.9,
      consultationFee: 700,
      qualification: 'MBBS, MD Pediatrics',
      about: 'Child health specialist with expertise in newborn care and pediatric infectious diseases.',
      address: 'Children\'s Hospital, Bangalore',
      isActive: true
    });

    console.log('👥 Created users (patients and doctors)');

    // Create Appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const appointment1 = await Appointment.create({
      patient: patient1._id,
      doctor: doctor1._id,
      appointmentDate: today,
      appointmentTime: '10:30 AM',
      reasonForVisit: 'Regular Checkup',
      symptoms: ['Chest pain', 'Shortness of breath'],
      status: 'confirmed',
      type: 'offline',
      consultationFee: 800,
      notes: {
        patient: 'Having chest pain for 2 days',
        doctor: '',
        admin: ''
      }
    });

    const appointment2 = await Appointment.create({
      patient: patient2._id,
      doctor: doctor2._id,
      appointmentDate: tomorrow,
      appointmentTime: '2:00 PM',
      reasonForVisit: 'Skin Consultation',
      symptoms: ['Rash on arms'],
      status: 'scheduled',
      type: 'online',
      consultationFee: 600,
      notes: {
        patient: 'Rash appeared last week',
        doctor: '',
        admin: ''
      }
    });

    const appointment3 = await Appointment.create({
      patient: patient1._id,
      doctor: doctor1._id,
      appointmentDate: nextWeek,
      appointmentTime: '11:00 AM',
      reasonForVisit: 'Follow-up',
      status: 'scheduled',
      type: 'offline',
      consultationFee: 800
    });

    const appointment4 = await Appointment.create({
      patient: patient3._id,
      doctor: doctor3._id,
      appointmentDate: today,
      appointmentTime: '3:30 PM',
      reasonForVisit: 'Child Vaccination',
      status: 'confirmed',
      type: 'offline',
      consultationFee: 700
    });

    console.log('📅 Created appointments');

    // Create Medical Reports
    const report1 = await MedicalReport.create({
      patient: patient1._id,
      doctor: doctor1._id,
      appointment: appointment1._id,
      reportType: 'Lab Report',
      diagnosis: 'Hypertension - Stage 1',
      symptoms: ['Headache', 'Dizziness'],
      prescription: [
        { medicine: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
        { medicine: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' }
      ],
      testResults: [
        { test: 'Blood Pressure', value: '145/90 mmHg', normalRange: '120/80 mmHg', status: 'High' },
        { test: 'Cholesterol', value: '220 mg/dL', normalRange: '<200 mg/dL', status: 'High' }
      ],
      recommendations: 'Reduce salt intake, regular exercise, follow-up in 2 weeks',
      notes: 'Patient responding well to medication. Continue current treatment.',
      status: 'active'
    });

    const report2 = await MedicalReport.create({
      patient: patient2._id,
      doctor: doctor2._id,
      reportType: 'Diagnostic Report',
      diagnosis: 'Allergic Dermatitis',
      symptoms: ['Red rash', 'Itching'],
      prescription: [
        { medicine: 'Hydrocortisone cream', dosage: '1%', frequency: 'Twice daily', duration: '7 days' }
      ],
      recommendations: 'Avoid known allergens, use gentle skincare products',
      notes: 'Mild allergic reaction, should resolve with treatment.',
      status: 'active'
    });

    console.log('📋 Created medical reports');

    // Create Message Conversations
    const conversation1 = await Message.create({
      participants: [patient1._id, doctor1._id],
      messages: [
        {
          sender: doctor1._id,
          content: 'Hello John, I hope you are feeling better after our last consultation.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: true
        },
        {
          sender: patient1._id,
          content: 'Yes, thank you doctor. The medication is working well.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          read: true
        },
        {
          sender: doctor1._id,
          content: 'Great to hear that. Please continue with the current dosage and let me know if you experience any side effects.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          read: true
        },
        {
          sender: patient1._id,
          content: 'Thank you for the prescription. When should I schedule the follow-up?',
          timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          read: false
        }
      ]
    });

    const conversation2 = await Message.create({
      participants: [patient2._id, doctor2._id],
      messages: [
        {
          sender: doctor2._id,
          content: 'Hi Jane, I received your photos. The rash looks like allergic dermatitis.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true
        },
        {
          sender: patient2._id,
          content: 'Thank you doctor. Should I be worried about it?',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
          read: true
        },
        {
          sender: doctor2._id,
          content: 'No need to worry. It\'s a mild reaction. I\'ve prescribed a cream that should help.',
          timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
          read: true
        }
      ]
    });

    console.log('💬 Created message conversations');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${await User.countDocuments()}`);
    console.log(`   📅 Appointments: ${await Appointment.countDocuments()}`);
    console.log(`   📋 Medical Reports: ${await MedicalReport.countDocuments()}`);
    console.log(`   💬 Conversations: ${await Message.countDocuments()}`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   Patient: john@example.com / password123');
    console.log('   Doctor: sarah@medimate.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
