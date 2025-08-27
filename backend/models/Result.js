const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedAnswer: { type: String, trim: true },
    marksObtained: { type: Number, default: 0 },
    isCorrect: { type: Boolean, default: false }
  }],
  theoryMarks: { type: Number, default: 0 },
  practicalMarks: { type: Number, default: 0 },
  vivaMarks: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'evaluated', 'approved', 'rejected'], 
    default: 'pending' 
  },
  evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  evaluatedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  feedback: { type: String, trim: true },
  timeSpent: { type: Number, default: 0 }, // in seconds
  ipAddress: { type: String, trim: true },
  deviceInfo: { type: String, trim: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
resultSchema.index({ exam: 1, candidate: 1 }, { unique: true });
resultSchema.index({ candidate: 1 });
resultSchema.index({ status: 1 });
resultSchema.index({ evaluatedBy: 1 });
resultSchema.index({ totalMarks: 1 });

// Pre-save middleware to calculate total marks and percentage
resultSchema.pre('save', function(next) {
  this.totalMarks = this.theoryMarks + this.practicalMarks + this.vivaMarks;
  
  const exam = this.populated('exam') || this.exam;
  if (exam && exam.totalMarks > 0) {
    this.percentage = (this.totalMarks / exam.totalMarks) * 100;
  }
  
  next();
});

// Virtual for result status (pass/fail)
resultSchema.virtual('resultStatus').get(function() {
  const exam = this.populated('exam') || this.exam;
  if (exam && this.totalMarks >= exam.passingMarks) {
    return 'pass';
  }
  return 'fail';
});

// Method to update evaluation
resultSchema.methods.updateEvaluation = function(theoryMarks, practicalMarks, vivaMarks, evaluatedBy, feedback = '') {
  this.theoryMarks = theoryMarks;
  this.practicalMarks = practicalMarks;
  this.vivaMarks = vivaMarks;
  this.evaluatedBy = evaluatedBy;
  this.evaluatedAt = new Date();
  this.status = 'evaluated';
  this.feedback = feedback;
  
  return this.save();
};

// Method to approve result
resultSchema.methods.approveResult = function(approvedBy) {
  this.approvedBy = approvedBy;
  this.approvedAt = new Date();
  this.status = 'approved';
  
  return this.save();
};

module.exports = mongoose.model('Result', resultSchema);