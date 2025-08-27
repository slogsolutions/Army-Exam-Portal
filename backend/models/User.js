const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  armyNo: { type: String, required: true, unique: true, trim: true },
  rank: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  trade: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  fatherName: { type: String, required: true, trim: true },
  enrollmentNo: { type: String, required: true, unique: true, trim: true },
  doe: { type: Date, required: true },
  aadharNumber: { type: String, required: true, unique: true, trim: true },
  unit: { type: String, required: true, trim: true },
  formation: {
    bde: { type: String, trim: true },
    div: { type: String, trim: true },
    corps: { type: String, trim: true },
    comd: { type: String, trim: true }
  },
  trgCentre: { type: String, required: true, trim: true },
  district: { type: String, trim: true },
  state: { type: String, trim: true },
  qualification: { type: String, trim: true },
  qualificationLevel: { type: String, trim: true },
  nsqfLevel: { type: String, trim: true },
  photograph: { type: String, default: '' },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'evaluator', 'candidate'], default: 'candidate' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ armyNo: 1 });
userSchema.index({ aadharNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ trade: 1 });

// Virtual for user's full name with rank
userSchema.virtual('fullNameWithRank').get(function() {
  return `${this.rank} ${this.name}`;
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Update last login on successful login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('User', userSchema);