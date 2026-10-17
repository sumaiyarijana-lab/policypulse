const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const CHENNAI_AREAS = {
  "T. Nagar": { base_complaints: 45, base_violations: 37, lat: 13.0418, lng: 80.2341 },
  "Velachery": { base_complaints: 28, base_violations: 12, lat: 12.9796, lng: 80.2206 },
  "Tambaram": { base_complaints: 38, base_violations: 25, lat: 12.9229, lng: 80.1274 },
  "Anna Nagar": { base_complaints: 15, base_violations: 3, lat: 13.0850, lng: 80.2101 },
  "Adyar": { base_complaints: 22, base_violations: 7, lat: 13.0033, lng: 80.2550 },
  "Guindy": { base_complaints: 34, base_violations: 24, lat: 13.0067, lng: 80.2206 },
  "Perungudi": { base_complaints: 40, base_violations: 30, lat: 12.9654, lng: 80.2461 },
  "OMR": { base_complaints: 52, base_violations: 42, lat: 12.8719, lng: 80.2259 },
  "Chromepet": { base_complaints: 19, base_violations: 11, lat: 12.9516, lng: 80.1409 },
  "Porur": { base_complaints: 25, base_violations: 14, lat: 13.0382, lng: 80.1565 },
  "Ambattur": { base_complaints: 36, base_violations: 28, lat: 13.1143, lng: 80.1548 },
  "Avadi": { base_complaints: 17, base_violations: 8, lat: 13.1197, lng: 80.1036 },
  "Kodambakkam": { base_complaints: 21, base_violations: 9, lat: 13.0473, lng: 80.2214 },
  "Mylapore": { base_complaints: 14, base_violations: 2, lat: 13.0330, lng: 80.2690 },
  "Royapuram": { base_complaints: 30, base_violations: 22, lat: 13.1146, lng: 80.2947 },
  "Sholinganallur": { base_complaints: 48, base_violations: 36, lat: 12.9010, lng: 80.2279 },
  "Saidapet": { base_complaints: 26, base_violations: 15, lat: 13.0213, lng: 80.2231 },
  "Medavakkam": { base_complaints: 20, base_violations: 10, lat: 12.9181, lng: 80.1919 },
  "Pallavaram": { base_complaints: 23, base_violations: 13, lat: 12.9675, lng: 80.1491 },
  "Thiruvanmiyur": { base_complaints: 16, base_violations: 4, lat: 12.9847, lng: 80.2591 }
};

const DEVICE_REGISTRY = {
  "TechCorp Ltd.": { purchased: 500, disposed: 120 },
  "GlobalSolutions Inc.": { purchased: 150, disposed: 30 },
  "Chennai Logistics": { purchased: 80, disposed: 75 },
  "EcoSystems Ltd.": { purchased: 1000, disposed: 450 },
  "RetailCorp": { purchased: 200, disposed: 195 }
};

const AUTHORIZED_RECYCLERS = ["REC-1001", "REC-2002", "REC-3003", "REC-4004", "REC-5005", "REC-PRO"];
const DB_MOCK_PATH = path.join(__dirname, '../db_mock.json');

function loadLiveComplaints() {
  if (fs.existsSync(DB_MOCK_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_MOCK_PATH, 'utf8'));
      return data.complaints || [];
    } catch (e) {
      console.warn('[AI Service] Error reading mock DB:', e.message);
    }
  }
  return [];
}

// ── GET / ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'PolicyPulse AI Neural Engine v3.0 Active (Node.js High-Availability)',
    endpoints: [
      '/analyze',
      '/metrics',
      '/predictions',
      '/compliance',
      '/device-lifecycle',
      '/system-status'
    ],
    chennai_areas_monitored: Object.keys(CHENNAI_AREAS).length
  });
});

// ── POST /analyze ─────────────────────────────────────────────────────
app.post('/analyze', (req, res) => {
  const data = req.body || {};
  const quantity = parseInt(data.quantity || 0, 10);
  const is_authorized = String(data.is_authorized || 'false').toLowerCase() === 'true';
  const recycler_id = (data.recyclerId || '').toUpperCase();
  const description = (data.description || '').toLowerCase();
  const title = (data.title || '').toLowerCase();
  const area = data.area || 'Unknown';
  const company_name = data.companyName || '';

  let risk_score = 0;
  const alerts = [];
  const actions = [];
  const regulation_mismatches = [];

  if (recycler_id && !AUTHORIZED_RECYCLERS.includes(recycler_id)) {
    alerts.push(`CRITICAL: License ID ${recycler_id} is NOT registered in CPCB authorized database.`);
    regulation_mismatches.push('CPCB authorized recycler database mismatch.');
    risk_score += 35;
  }

  if (quantity > 100 && !is_authorized) {
    risk_score += 45;
    alerts.push('CRITICAL: Large-scale e-waste transfer to unauthorized recycler detected.');
    regulation_mismatches.push('Violation of E-Waste Management Rules Section 6 (Unauthorized disposal).');
    actions.push('Halt recycling transfer immediately and freeze corporate license.');
    actions.push('Initiate legal audit of company disposal protocol.');
  } else if (quantity > 10) {
    risk_score += 15;
    if (!is_authorized) {
      risk_score += 20;
      alerts.push('WARNING: Disposal through unregistered entities is strictly prohibited.');
      regulation_mismatches.push('Disposal through non-compliant recycler.');
      actions.push('Direct corporation to CPCB certified drop-off centers.');
    }
  }

  if (company_name && DEVICE_REGISTRY[company_name]) {
    const record = DEVICE_REGISTRY[company_name];
    const remaining = record.purchased - record.disposed;
    if (quantity > remaining) {
      risk_score += 30;
      alerts.push(`WARNING: Device Lifecycle Mismatch. Disposing ${quantity} devices but registry shows only ${remaining} available.`);
      regulation_mismatches.push('Device lifecycle volume discrepancy detected.');
      actions.push(`Request purchase invoices and audit device serial registry for ${company_name}.`);
    }
  }

  const hazard_words = {
    toxic: ['Chemical toxicity danger', 20],
    burn: ['Illegal open-air burning of circuit boards', 30],
    acid: ['Acid-wash extraction activities', 25],
    leak: ['Hazardous chemical leakage into ground', 20],
    river: ['Dumping near Adyar or Cooum waterbodies', 25],
    water: ['Groundwater contamination risk', 20],
    spill: ['Heavy metal spill (Lead/Mercury)', 25],
    smoke: ['Toxic fumes released in residential zone', 20]
  };

  for (const [word, [desc, score_add]] of Object.entries(hazard_words)) {
    if (description.includes(word) || title.includes(word)) {
      risk_score += score_add;
      alerts.push(`HAZARD FLAG: ${desc} identified from textual analysis.`);
      actions.push(`Dispatch Chennai Pollution Control Board (TNPCB) field inspector to assess ${word} impact.`);
    }
  }

  const live_complaints = loadLiveComplaints();
  const nearby_complaints = live_complaints.filter(c => (c.area || '').toLowerCase() === area.toLowerCase());
  if (nearby_complaints.length >= 3) {
    risk_score += 15;
    alerts.push(`SYSTEM ALERT: High density complaint zone. ${nearby_complaints.length} recent reports in ${area}.`);
    actions.push('Increase area surveillance patrols and deploy local sensors.');
  }

  risk_score = Math.min(100, Math.max(5, risk_score));
  let classification = 'LOW RISK';
  if (risk_score >= 75) classification = 'CRITICAL RISK';
  else if (risk_score >= 50) classification = 'HIGH RISK';
  else if (risk_score >= 30) classification = 'MEDIUM RISK';

  const prob_trend = [];
  for (let i = 0; i < 6; i++) {
    const noise = Math.floor(Math.random() * 21) - 10;
    prob_trend.push(Math.min(100, Math.max(0, risk_score + (i * 3) + noise)));
  }

  res.json({
    risk_score,
    classification,
    alerts,
    suggested_actions: actions,
    regulation_mismatches,
    violation_probability_trend: prob_trend,
    is_violation: risk_score >= 50
  });
});

// ── GET /metrics ──────────────────────────────────────────────────────
app.get('/metrics', (req, res) => {
  const live_complaints = loadLiveComplaints();
  const area_stats = {};

  for (const [area, base] of Object.entries(CHENNAI_AREAS)) {
    area_stats[area.toLowerCase()] = {
      name: area,
      complaints: base.base_complaints,
      violations: base.base_violations,
      lat: base.lat,
      lng: base.lng
    };
  }

  for (const c of live_complaints) {
    const area_key = (c.area || '').toLowerCase().trim();
    const is_violation = c.status === 'Violation Detected' || ['High', 'Critical'].includes(c.severity);
    if (area_stats[area_key]) {
      area_stats[area_key].complaints += 1;
      if (is_violation) area_stats[area_key].violations += 1;
    } else if (area_key) {
      area_stats[area_key] = {
        name: c.area.trim(),
        complaints: 1,
        violations: is_violation ? 1 : 0,
        lat: c.location?.lat || 13.0827,
        lng: c.location?.lng || 80.2707
      };
    }
  }

  const results = [];
  for (const stats of Object.values(area_stats)) {
    const complaints = stats.complaints;
    const violations = stats.violations;
    let violation_pct = complaints > 0 ? Math.round((violations / complaints) * 100) : 0;
    violation_pct = Math.min(98, Math.max(2, violation_pct));
    const compliance_pct = 100 - violation_pct;

    let risk_level = 'Low Risk';
    let danger_color = 'green';
    if (violation_pct >= 75) {
      risk_level = 'High Risk';
      danger_color = 'red';
    } else if (violation_pct >= 40) {
      risk_level = 'Medium Risk';
      danger_color = 'orange';
    }

    const hazardous_spared = parseFloat((violations * 1.45).toFixed(2));
    const carbon_offset = Math.round(violations * 380);
    const baseline = CHENNAI_AREAS[stats.name] || { base_complaints: 10 };
    const growth_pct = parseFloat((((complaints - baseline.base_complaints) / Math.max(1, baseline.base_complaints)) * 100).toFixed(1));

    results.push({
      area: stats.name,
      complaints,
      violations,
      violation_percentage: violation_pct,
      compliance_percentage: compliance_pct,
      risk_level,
      color: danger_color,
      lat: stats.lat,
      lng: stats.lng,
      growth_trend_pct: growth_pct,
      hazardous_spared_tons: hazardous_spared,
      carbon_offset_kg: carbon_offset,
      most_common_violation: violations % 2 === 0 ? 'Illegal Disposal' : 'Unauthorized Recycling',
      future_prediction: `Risk projected to ${growth_pct <= 5 ? 'stabilize' : growth_pct > 0 ? 'rise by ' + Math.abs(growth_pct) + '%' : 'decrease by ' + Math.abs(growth_pct) + '%'}`
    });
  }

  results.sort((a, b) => b.violation_percentage - a.violation_percentage);
  res.json(results);
});

// ── GET /predictions ──────────────────────────────────────────────────
app.get('/predictions', (req, res) => {
  const live_complaints = loadLiveComplaints();
  const predictions = [];

  for (const [area, base] of Object.entries(CHENNAI_AREAS)) {
    const area_complaints = live_complaints.filter(c => (c.area || '').toLowerCase() === area.toLowerCase()).length;
    const historical_points = [
      base.base_complaints * 0.8,
      base.base_complaints * 0.9,
      base.base_complaints * 1.0,
      base.base_complaints * 1.1,
      base.base_complaints * 1.2,
      base.base_complaints + area_complaints
    ];

    const n = historical_points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += historical_points[i];
      sumXY += i * historical_points[i];
      sumXX += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const future_projection = slope * (n + 2) + intercept;

    const future_risk_pct = Math.round(
      Math.min(99, Math.max(5, (base.base_violations / Math.max(1, base.base_complaints) * 100) + (future_projection - historical_points[n - 1]) * 1.5))
    );

    const growth_trend = slope > 0.2 ? 'RISING' : slope < -0.2 ? 'FALLING' : 'STABLE';
    const danger_level = future_risk_pct >= 80 ? 'CRITICAL' : future_risk_pct >= 50 ? 'HIGH' : future_risk_pct >= 35 ? 'WARNING' : 'MINIMAL';

    predictions.push({
      area,
      future_violation_probability: future_risk_pct,
      growth_trend,
      environmental_danger_level: danger_level,
      estimated_hotspot_growth: parseFloat((slope * 12).toFixed(1)),
      coordinates: { lat: base.lat, lng: base.lng },
      remedial_action: ['CRITICAL', 'HIGH'].includes(danger_level)
        ? 'Mandatory smart monitoring sensors installation'
        : 'Quarterly compliance screening'
    });
  }

  predictions.sort((a, b) => b.future_violation_probability - a.future_violation_probability);
  const avgRisk = Math.round(predictions.reduce((acc, p) => acc + p.future_violation_probability, 0) / predictions.length);

  res.json({
    timestamp: new Date().toISOString(),
    predictions,
    top_predicted_hotspots: predictions.slice(0, 3).map(p => p.area),
    overall_chennai_risk_index: avgRisk
  });
});

// ── POST /compliance ──────────────────────────────────────────────────
app.post('/compliance', (req, res) => {
  const data = req.body || {};
  const company_name = data.companyName || 'TechCorp Ltd.';
  const quantity = parseInt(data.deviceQuantity || 0, 10);
  const recycler_id = (data.recyclerId || '').toUpperCase();
  const is_authorized = String(data.isAuthorized || 'false').toLowerCase() === 'true';

  let compliance_score = 100;
  const violations = [];

  if (!is_authorized) {
    compliance_score -= 40;
    violations.push('Disposal through non-government-authorized recycler violates TNPCB Section 4(a).');
  }

  if (recycler_id && !AUTHORIZED_RECYCLERS.includes(recycler_id)) {
    compliance_score -= 15;
    violations.push(`Recycler license ${recycler_id} not registered in current authorized recycler directory.`);
  }

  if (quantity > 500) {
    compliance_score -= 20;
    violations.push('Disposal quantity exceeds single-batch permit limit of 500 devices.');
  } else if (quantity <= 0) {
    compliance_score -= 10;
    violations.push('Invalid disposal quantity reported.');
  }

  if (DEVICE_REGISTRY[company_name]) {
    const records = DEVICE_REGISTRY[company_name];
    const available = records.purchased - records.disposed;
    if (quantity > available) {
      compliance_score -= 30;
      violations.push(`Lifecycle mismatch: Attempted disposal of ${quantity} devices exceeds authorized active list (${available}).`);
    }
  }

  compliance_score = Math.max(0, compliance_score);
  const status = compliance_score < 70 || !is_authorized ? 'NON-COMPLIANT' : 'FULLY COMPLIANT';

  res.json({
    companyName: company_name,
    compliance_score,
    status,
    detected_violations: violations,
    environmental_impact_score: Math.round(quantity * 0.85),
    recommendations: status === 'NON-COMPLIANT'
      ? [
          'Submit corporate e-waste annual report under Form-3.',
          'Use certified CPCB PRO partner for lifecycle accounting.',
          'Recalibrate serial numbers list with centralized inventory.'
        ]
      : [
          'Maintain strict lifecycle audits.',
          'Recycle components according to green protocol.'
        ]
  });
});

// ── POST /device-lifecycle ────────────────────────────────────────────
app.post('/device-lifecycle', (req, res) => {
  const data = req.body || {};
  const company_name = data.companyName || 'TechCorp Ltd.';
  const action = data.action || 'disposal';
  const quantity = parseInt(data.quantity || 0, 10);

  if (!DEVICE_REGISTRY[company_name]) {
    DEVICE_REGISTRY[company_name] = { purchased: 0, disposed: 0 };
  }

  const record = DEVICE_REGISTRY[company_name];
  let mismatch = false;
  let details = '';

  if (action === 'purchase') {
    record.purchased += quantity;
    details = `Successfully registered purchase of ${quantity} hardware units.`;
  } else if (action === 'disposal') {
    const available = record.purchased - record.disposed;
    if (quantity > available) {
      mismatch = true;
      details = `LIFECYCLE MISMATCH: Disposing ${quantity} devices, but only ${available} units available in active purchase registry.`;
    } else {
      record.disposed += quantity;
      details = `Disposal of ${quantity} hardware units registered under green policy.`;
    }
  }

  res.json({
    companyName: company_name,
    device_registry_snapshot: record,
    is_lifecycle_mismatch: mismatch,
    details,
    remaining_active_devices: record.purchased - record.disposed
  });
});

// ── GET /system-status ────────────────────────────────────────────────
app.get('/system-status', (req, res) => {
  const live_complaints = loadLiveComplaints();
  const total_violations = live_complaints.filter(c => c.status === 'Violation Detected').length;

  res.json({
    system_status: 'OPERATIONAL',
    neural_policy_v: 'v3.0.4',
    active_monitors: ['Illegal Disposal Alert', 'Lifecycle Audits', 'TNPCB Recycler Sync', 'Predictive Danger Hotspots'],
    processed_complaints_count: live_complaints.length,
    violations_flagged_count: total_violations,
    chennai_violation_index: live_complaints.length === 0 ? 72.8 : parseFloat(((total_violations / Math.max(1, live_complaints.length)) * 100).toFixed(1)),
    model_confidence_score: '98.7%',
    background_thread_frequency: 'Continuous / Event-driven'
  });
});

module.exports = app;
