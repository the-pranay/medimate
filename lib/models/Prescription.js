import mongoose from 'mongoose';

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
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
    ref: 'Appointment',
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  medicines: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      required: true,
      trim: true
    },
    frequency: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    instructions: {
      type: String,
      trim: true
    }
  }],
  instructions: {
    type: String,
    trim: true
  },
  followUpDate: {
    type: Date,
    required: false
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  prescriptionDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for prescription age
prescriptionSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.prescriptionDate) / (1000 * 60 * 60 * 24));
});

// Method to check if prescription is recent (within 30 days)
prescriptionSchema.methods.isRecent = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.prescriptionDate >= thirtyDaysAgo;
};

// Method to format medicines for display
prescriptionSchema.methods.getFormattedMedicines = function() {
  return this.medicines.map(med => ({
    ...med.toObject(),
    displayText: `${med.name} - ${med.dosage} ${med.frequency} for ${med.duration}`
  }));
};

export default mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
