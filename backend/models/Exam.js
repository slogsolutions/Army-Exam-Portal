const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  trade: { type: String, required: true, trim: true },
  level: { type: String, required: true, trim: true },
  skill: { type: String, required: true, trim: true },
  dateTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  totalMarks: { type: Number, required: true, default: 100 },
  passingMarks: { type: Number, required: true, default: 40 },
  instructions: { type: String, trim: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false },
  publishDate: { type: Date }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
examSchema.index({ trade: 1, level: 1, skill: 1 });
examSchema.index({ dateTime: 1 });
examSchema.index({ createdBy: 1 });
examSchema.index({ isActive: 1, isPublished: 1 });

// Virtual for exam status
examSchema.virtual('status').get(function() {
  const now = new Date();
  if (!this.isPublished) return 'draft';
  if (now < this.dateTime) return 'scheduled';
  if (now > new Date(this.dateTime.getTime() + this.duration * 60000)) return 'completed';
  return 'ongoing';
});

// Virtual for calculating time remaining
examSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'ongoing') return null;
  const endTime = new Date(this.dateTime.getTime() + this.duration * 60000);
  return endTime - new Date();
});

module.exports = mongoose.model('Exam', examSchema);