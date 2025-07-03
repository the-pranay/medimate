import mongoose from 'mongoose';

// Medical Record Schema
const medicalRecordSchema = new mongoose.Schema({
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
  recordType: {
    type: String,
    enum: ['consultation', 'lab-report', 'prescription', 'diagnosis', 'surgery', 'vaccination', 'other'],
    default: 'consultation'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  diagnosis: {
    primary: {
      type: String,
      trim: true
    },
    secondary: [{
      type: String,
      trim: true
    }],
    icd10Code: String
  },
  symptoms: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    duration: String,
    description: String
  }],
  vitals: {
    temperature: {
      value: Number,
      unit: {
        type: String,
        enum: ['C', 'F'],
        default: 'C'
      }
    },
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      unit: {
        type: String,
        default: 'mmHg'
      }
    },
    pulse: {
      value: Number,
      unit: {
        type: String,
        default: 'bpm'
      }
    },
    respiratoryRate: {
      value: Number,
      unit: {
        type: String,
        default: 'breaths/min'
      }
    },
    height: {
      value: Number,
      unit: {
        type: String,
        enum: ['cm', 'ft'],
        default: 'cm'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
      }
    },
    bmi: Number,
    oxygenSaturation: {
      value: Number,
      unit: {
        type: String,
        default: '%'
      }
    }
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    duration: String,
    route: {
      type: String,
      enum: ['oral', 'topical', 'injection', 'inhalation', 'other'],
      default: 'oral'
    },
    instructions: String,
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    unit: String,
    isAbnormal: {
      type: Boolean,
      default: false
    },
    testDate: Date,
    labName: String,
    reportFile: String
  }],
  attachments: [{
    fileName: String,
    fileType: String,
    fileSize: Number,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpReason: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isConfidential: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    doctor: String,
    patient: String,
    admin: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
medicalRecordSchema.index({ patient: 1, createdAt: -1 });
medicalRecordSchema.index({ doctor: 1, createdAt: -1 });
medicalRecordSchema.index({ appointment: 1 });
medicalRecordSchema.index({ recordType: 1 });
medicalRecordSchema.index({ priority: 1 });

// Method to check if record is recent (within last 30 days)
medicalRecordSchema.methods.isRecent = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.createdAt > thirtyDaysAgo;
};

// Method to check if follow-up is due
medicalRecordSchema.methods.isFollowUpDue = function() {
  if (!this.followUpRequired || !this.followUpDate) return false;
  return new Date() >= this.followUpDate;
};

export default mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', medicalRecordSchema);
