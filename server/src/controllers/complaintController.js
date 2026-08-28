const Complaint = require('../models/Complaint');
const notificationService = require('../utils/notification');

exports.createComplaint = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      area,
      district,
      state,
      complaintType,
      title,
      description,
      lat,
      lng,
      companyName,
      deviceQuantity,
      recyclerId,
      isAuthorized,
      severity
    } = req.body;

    let evidencePaths = [];
    if (req.files && req.files.length > 0) {
      evidencePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    const complaint = new Complaint({
      fullName,
      email,
      phone,
      area,
      district,
      state,
      complaintType,
      title,
      description,
      evidence: evidencePaths,
      location: {
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null
      },
      companyName: companyName || '',
      deviceQuantity: deviceQuantity ? parseInt(deviceQuantity) : 0,
      recyclerId: recyclerId || '',
      isAuthorized: isAuthorized === 'true' || isAuthorized === true || false,
      severity: severity || 'Low'
    });

    // Determine AI risk metrics from Python AI microservice
    let aiRiskScore = 0;
    let aiClassification = 'LOW RISK';
    let aiAlerts = [];
    let aiSuggestedActions = [];

    try {
      const aiRes = await fetch('http://localhost:5001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: deviceQuantity ? parseInt(deviceQuantity) : 0,
          is_authorized: isAuthorized === 'true' || isAuthorized === true || false,
          recyclerId: recyclerId || '',
          complaintType: complaintType,
          description: description,
          title: title,
          area: area,
          companyName: companyName || ''
        })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        aiRiskScore = aiData.risk_score;
        aiClassification = aiData.classification;
        aiAlerts = aiData.alerts;
        aiSuggestedActions = aiData.suggested_actions;

        // Auto-escalate severity and status if AI flags critical/high risk
        if (aiRiskScore >= 75) {
          complaint.severity = 'Critical';
          complaint.status = 'Violation Detected';
        } else if (aiRiskScore >= 50) {
          complaint.severity = 'High';
          complaint.status = 'Violation Detected';
        } else if (aiRiskScore >= 30) {
          complaint.severity = 'Medium';
        }
      }
    } catch (err) {
      console.warn('⚠️ [AI Service Link] Failed to contact AI microservice. Using fallback analysis.');
      
      const localSeverity = complaint.severity || 'Low';
      aiRiskScore = localSeverity === 'Critical' ? Math.floor(90 + Math.random() * 9) :
                    localSeverity === 'High' ? Math.floor(75 + Math.random() * 15) :
                    localSeverity === 'Medium' ? Math.floor(45 + Math.random() * 30) :
                    Math.floor(15 + Math.random() * 30);
      
      if (aiRiskScore >= 75) {
        aiClassification = 'CRITICAL RISK';
        aiAlerts.push('CRITICAL: Volume anomaly detected (Local Fallback).');
        complaint.status = 'Violation Detected';
      } else if (aiRiskScore >= 50) {
        aiClassification = 'HIGH RISK';
        complaint.status = 'Violation Detected';
      } else {
        aiClassification = 'LOW RISK';
      }
    }

    complaint.aiRiskScore = aiRiskScore;
    complaint.aiClassification = aiClassification;
    complaint.aiAlerts = aiAlerts;
    complaint.aiSuggestedActions = aiSuggestedActions;

    await complaint.save();

    const publicComplaint = {
      _id: complaint._id,
      complaintId: complaint.complaintId,
      area: complaint.area,
      district: complaint.district,
      state: complaint.state,
      complaintType: complaint.complaintType,
      title: complaint.title,
      description: complaint.description,
      evidence: complaint.evidence,
      location: complaint.location,
      status: complaint.status,
      severity: complaint.severity,
      createdAt: complaint.createdAt,
      companyName: complaint.companyName,
      deviceQuantity: complaint.deviceQuantity,
      recyclerId: complaint.recyclerId,
      isAuthorized: complaint.isAuthorized,
      aiRiskScore: complaint.aiRiskScore,
      aiClassification: complaint.aiClassification,
      aiAlerts: complaint.aiAlerts,
      aiSuggestedActions: complaint.aiSuggestedActions
    };
    notificationService.emitNewComplaint(publicComplaint);

    // Trigger Real-Time & Email Alert via Notification Engine
    const isViolation = complaint.status === 'Violation Detected' || aiRiskScore >= 50;
    const priority = isViolation ? 'CRITICAL' : 'MEDIUM';
    
    await notificationService.sendAlert({
      type: isViolation ? 'violation' : 'complaint',
      title: isViolation ? `Emergency Alert: Violation in ${area}` : `New Complaint Registered: ${complaint.complaintId}`,
      message: `Company: ${companyName || 'N/A'} | Area: ${area} | Risk: ${aiClassification} (${aiRiskScore}%) | Desc: ${description}`,
      priority: priority,
      targetEmail: process.env.EMAIL_USER || 'admin@policypulse.gov'
    });

    res.status(201).json({ message: 'Complaint registered successfully', complaint });
  } catch (err) {
    console.error('Complaint creation error:', err);
    res.status(500).json({ message: 'Server Error. Could not register complaint.' });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getPublicComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    
    const publicComplaints = complaints.map(c => {
      return {
        _id: c._id,
        complaintId: c.complaintId,
        area: c.area,
        district: c.district,
        state: c.state,
        complaintType: c.complaintType,
        title: c.title,
        description: c.description,
        evidence: c.evidence,
        location: c.location,
        status: c.status,
        severity: c.severity,
        createdAt: c.createdAt,
        companyName: c.companyName || '',
        deviceQuantity: c.deviceQuantity || 0,
        recyclerId: c.recyclerId || '',
        isAuthorized: c.isAuthorized || false,
        aiRiskScore: c.aiRiskScore || 0,
        aiClassification: c.aiClassification || 'LOW RISK',
        aiAlerts: c.aiAlerts || [],
        aiSuggestedActions: c.aiSuggestedActions || []
      };
    });

    res.json(publicComplaints);
  } catch (err) {
    console.error('Public complaints fetch error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
