const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ['mcq', 'fill', 'short', 'long'], 
    required: true 
  },
  options: [{ type: String, trim: true }], // For MCQ type
  correctAnswer: { type: String, required: true, trim: true },
  marks: { type: Number, required: true, default: 1 },
  trade: { type: String, required: true, trim: true },
  level: { type: String, required: true, trim: true },
  skill: { type: String, required: true, trim: true },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  },
  explanation: { type: String, trim: true }, // For answer explanation
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 } // Track how many times used in exams
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
questionSchema.index({ trade: 1, level: 1, skill: 1 });
questionSchema.index({ type: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ isActive: 1 });

// Method to increment usage count
questionSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

module.exports = mongoose.model('Question', questionSchema);