const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  area: { type: String, required: true },
  district: { type: String },
  state: { type: String },
  complaintType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  evidence: [{ type: String }],
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Resolved', 'Violation Detected'], 
    default: 'Pending' 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Low' 
  },
  
  // Advanced e-waste tracking fields
  companyName: { type: String, default: '' },
  deviceQuantity: { type: Number, default: 0 },
  recyclerId: { type: String, default: '' },
  isAuthorized: { type: Boolean, default: false },
  
  // AI analysis persistence
  aiRiskScore: { type: Number, default: 0 },
  aiClassification: { type: String, default: 'LOW RISK' },
  aiAlerts: [{ type: String }],
  aiSuggestedActions: [{ type: String }],
  
  createdAt: { type: Date, default: Date.now }
});

ComplaintSchema.pre('save', function(next) {
  if (!this.complaintId) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    this.complaintId = `CMP-${Date.now().toString().slice(-4)}${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
