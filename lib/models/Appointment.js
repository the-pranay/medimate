
import mongoose from 'mongoose';
// Ensure User model is registered for population
import './User';

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
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
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'paid', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['online', 'offline', 'emergency'],
    default: 'offline'
  },
  reasonForVisit: {
    type: String,
    required: true,
    trim: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  notes: {
    patient: String,
    doctor: String,
    admin: String
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    tests: [{
      name: String,
      reason: String,
      urgent: {
        type: Boolean,
        default: false
      }
    }],
    followUp: {
      required: {
        type: Boolean,
        default: false
      },
      afterDays: Number,
      reason: String
    }
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'cash', 'insurance'],
      default: 'card'
    },
    transactionId: String,
    paidAt: Date
  },
  meetingLink: {
    type: String,
    required: function() { return this.type === 'online'; }
  },
  // Video call fields
  callStartTime: Date,
  callEndTime: Date,
  callDuration: Number, // in seconds
  videoMeetingId: String,
  agoraChannelName: String,
  callStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'ended', 'failed'],
    default: 'not_started'
  },
  rating: {
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    ratedAt: Date
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  confirmedAt: Date,
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });

// Virtual for appointment date and time combined
appointmentSchema.virtual('fullDateTime').get(function() {
  const date = new Date(this.appointmentDate);
  const [hours, minutes] = this.appointmentTime.split(':');
  date.setHours(parseInt(hours), parseInt(minutes));
  return date;
});

// Method to check if appointment is today
appointmentSchema.methods.isToday = function() {
  const today = new Date();
  const appointmentDate = new Date(this.appointmentDate);
  return appointmentDate.toDateString() === today.toDateString();
};

// Method to check if appointment is upcoming
appointmentSchema.methods.isUpcoming = function() {
  const now = new Date();
  const appointmentDateTime = this.fullDateTime;
  return appointmentDateTime > now;
};

// Method to check if appointment is past
appointmentSchema.methods.isPast = function() {
  const now = new Date();
  const appointmentDateTime = this.fullDateTime;
  return appointmentDateTime < now;
};

export default mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
