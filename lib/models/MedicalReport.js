import mongoose from 'mongoose';

// Medical Report Schema
const medicalReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Lab Report', 'Test Report', 'Prescription', 'X-Ray', 'MRI', 'CT Scan', 'Blood Test', 'ECG', 'Other'],
    required: true
  },
  description: String,
  findings: String,
  recommendations: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  labValues: [{
    parameter: String,
    value: String,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical']
    }
  }],
  files: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'available', 'archived'],
    default: 'available'
  },
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
medicalReportSchema.index({ patient: 1, createdAt: -1 });
medicalReportSchema.index({ doctor: 1, createdAt: -1 });
medicalReportSchema.index({ type: 1, status: 1 });

export default mongoose.models.MedicalReport || mongoose.model('MedicalReport', medicalReportSchema);
