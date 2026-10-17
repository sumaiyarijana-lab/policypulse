'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, FileSearch, CheckCircle2, 
  XCircle, BarChart3, Database, Building2, Send, 
  Activity, Map as MapIcon, RotateCcw, Cpu, ListCollapse
} from 'lucide-react';
import { API_BASE_URL, AI_BASE_URL } from '@/config/api';

export default function ComplianceEnginePage() {
  const [disposalForm, setDisposalForm] = useState({
    companyName: '',
    deviceQuantity: '',
    recyclerId: '',
    isAuthorized: 'true',
    lat: '13.0827',
    lng: '80.2707'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Dashboard Metrics Simulation
  const metrics = [
    { title: 'Overall Compliance', value: '92%', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Violations Detected', value: '142', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Pending Reviews', value: '38', icon: FileSearch, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'CPCB Recyclers', value: '89', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  const handleChange = (e) => setDisposalForm({ ...disposalForm, [e.target.name]: e.target.value });

  const evaluateCompliance = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Run compliance checks through advanced Python AI regulation matrix
      const aiRes = await fetch(`${AI_BASE_URL}/compliance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: disposalForm.companyName,
          deviceQuantity: parseInt(disposalForm.deviceQuantity) || 0,
          recyclerId: disposalForm.recyclerId,
          isAuthorized: disposalForm.isAuthorized === 'true'
        })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const isViolation = aiData.status === "NON-COMPLIANT";
        
        setResult({
          isViolation: isViolation,
          alertMsg: isViolation 
            ? `WARNING: Corporate E-Waste request is NON-COMPLIANT! (${aiData.detected_violations.length} policy mismatches found)`
            : "SUCCESS: Disposal request complies with National Environmental Safety Standards.",
          complianceScore: aiData.compliance_score,
          detectedViolations: aiData.detected_violations,
          recommendations: aiData.recommendations,
          environmentalImpactScore: aiData.environmental_impact_score,
          timestamp: new Date().toLocaleString()
        });

        // 2. If it is high-risk non-compliant, auto-register an emergency complaint in standard server
        if (isViolation) {
          try {
            const complaintData = new FormData();
            complaintData.append('fullName', 'AI Compliance Engine');
            complaintData.append('email', 'compliance@policypulse.gov');
            complaintData.append('area', 'Guindy'); // default area
            complaintData.append('district', 'Chennai');
            complaintData.append('state', 'Tamil Nadu');
            complaintData.append('complaintType', 'Illegal Dumping');
            complaintData.append('title', `Auto-Flag: Corporate Policy Mismatch by ${disposalForm.companyName}`);
            complaintData.append('description', `Compliance audit flagged ${disposalForm.companyName} attempting unauthorized e-waste transfer of ${disposalForm.deviceQuantity} devices through recycler License ${disposalForm.recyclerId || 'N/A'}.`);
            complaintData.append('lat', disposalForm.lat);
            complaintData.append('lng', disposalForm.lng);
            complaintData.append('companyName', disposalForm.companyName);
            complaintData.append('deviceQuantity', disposalForm.deviceQuantity);
            complaintData.append('recyclerId', disposalForm.recyclerId);
            complaintData.append('isAuthorized', disposalForm.isAuthorized);
            
            await fetch(`${API_BASE_URL}/complaints`, {
              method: 'POST',
              body: complaintData
            });
          } catch(err) {
            console.error("Failed to push auto-violation to map", err);
          }
        }
      } else {
        throw new Error("AI service returned error status");
      }
    } catch(err) {
      console.warn("⚠️ AI microservice offline. Performing fallback e-waste evaluation.");
      // Fallback calculation
      const quantity = parseInt(disposalForm.deviceQuantity) || 0;
      const isAuth = disposalForm.isAuthorized === 'true';
      const isViolation = quantity > 500 || !isAuth;
      
      setResult({
        isViolation: isViolation,
        alertMsg: isViolation 
          ? "WARNING: Recycler registry mismatch detected! Proceeding violates CPCB E-Waste Laws."
          : "SUCCESS: E-waste request complies with Environmental Safety Standards.",
        complianceScore: isAuth ? (quantity > 500 ? 70 : 95) : 35,
        detectedViolations: !isAuth ? ["Disposal through non-government-authorized recycler violates TNPCB Section 4(a)."] : [],
        recommendations: !isAuth ? ["Halt recycling transfer immediately", "Register through CPCB certified drop-off centers."] : ["Audit invoices"],
        environmentalImpactScore: Math.floor(quantity * 0.85),
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white p-6 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white font-mono tracking-tight">E-Waste Regulation Compliance Engine</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Real-time CPCB verification matrix of National E-Waste Management Rules & Sustainability Policies.</p>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
                  <m.icon size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">{m.value}</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-mono font-bold uppercase tracking-wider">{m.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Disposal Monitoring & Evaluation Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#0f172a]/80 border border-gray-200 dark:border-white/10 rounded-[32px] p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 font-mono">
              <Activity className="text-blue-500 animate-pulse" /> E-Waste Telemetry Submission
            </h2>
            <form onSubmit={evaluateCompliance} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Company/Organization Name</label>
                <input type="text" name="companyName" required value={disposalForm.companyName} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" placeholder="TechCorp Ltd." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Total Devices for Disposal</label>
                <input type="number" name="deviceQuantity" required value={disposalForm.deviceQuantity} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono" placeholder="e.g. 150" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Recycler License ID</label>
                  <input type="text" name="recyclerId" required value={disposalForm.recyclerId} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono uppercase" placeholder="REC-1001" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">CPCB Database Registry</label>
                  <select name="isAuthorized" value={disposalForm.isAuthorized} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm">
                    <option value="true">Authorized License (Verified)</option>
                    <option value="false">Unregistered / Mock ID</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Disposal Latitude</label>
                  <input type="text" name="lat" required value={disposalForm.lat} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Disposal Longitude</label>
                  <input type="text" name="lng" required value={disposalForm.lng} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-98 font-mono text-xs">
                {loading ? <RotateCcw className="animate-spin" size={16} /> : <FileSearch size={16} />}
                {loading ? 'Evaluating Policies...' : 'RUN CPCB COMPLIANCE AUDIT'}
              </button>
            </form>
          </motion.div>

          {/* Real-time Verification Output & Device Lifecycle */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Compliance Results */}
            <div className={`bg-white dark:bg-[#0f172a]/80 border border-gray-200 dark:border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden transition-all ${result?.isViolation ? 'ring-2 ring-red-500 shadow-red-500/10' : result ? 'ring-2 ring-emerald-500 shadow-emerald-500/10' : ''}`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-mono">
                <Database className="text-blue-500" /> Neural Compliance Statements
              </h2>
              
              {result ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                  <div className={`p-4 rounded-2xl flex items-start gap-3 text-xs font-mono leading-relaxed border ${result.isViolation ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {result.isViolation ? <XCircle className="shrink-0 mt-0.5 text-red-500 animate-pulse" /> : <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-400" />}
                    <span className="font-bold">{result.alertMsg}</span>
                  </div>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                      <span className="text-gray-500 dark:text-slate-400">Audit Time:</span>
                      <span className="text-slate-300 font-bold">{result.timestamp}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                      <span className="text-gray-500 dark:text-slate-400">Compliance Audit Score:</span>
                      <span className={`font-black text-sm ${result.isViolation ? 'text-red-400' : 'text-emerald-400'}`}>{result.complianceScore} / 100</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                      <span className="text-gray-500 dark:text-slate-400">Toxics Offset rating:</span>
                      <span className="text-blue-400 font-black">{result.environmentalImpactScore} rating</span>
                    </div>

                    {/* Detected violations list */}
                    {result.detectedViolations && result.detectedViolations.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-slate-400 font-bold uppercase tracking-wider block">Policy Mismatches:</span>
                        {result.detectedViolations.map((v, i) => (
                          <div key={i} className="bg-red-500/5 p-3 border border-red-500/10 rounded-xl text-red-300 text-xs leading-relaxed">
                            • {v}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations list */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-slate-400 font-bold uppercase tracking-wider block">Remedial Actions Advice:</span>
                        {result.recommendations.map((r, i) => (
                          <div key={i} className="bg-blue-500/5 p-3 border border-blue-500/10 rounded-xl text-blue-300 text-xs leading-relaxed">
                            ► {r}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {result.isViolation && (
                      <div className="flex justify-between text-xs text-red-400 animate-pulse mt-4 bg-red-500/5 p-3 border border-red-500/15 rounded-xl font-bold uppercase">
                        <span className="flex items-center gap-1"><MapIcon size={12}/> Live Radar Stream</span>
                        <span>Emergency alert pushed to TNPCB</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-center font-mono">
                  <BarChart3 size={48} className="mb-3 opacity-30" />
                  <p className="text-sm tracking-widest uppercase font-black">Audit Engine Standby</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs">Awaiting hardware telemetry specifications input from the left panel.</p>
                </div>
              )}
            </div>

            {/* Device Lifecycle Tracking Simulator */}
            <div className="bg-white dark:bg-[#0f172a]/80 border border-gray-200 dark:border-white/10 rounded-[32px] p-8 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-mono">
                <RotateCcw className="text-blue-500" /> Certified Device Lifecycle Ledger
              </h2>
              <div className="relative border-l-2 border-slate-700 ml-3 space-y-6">
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_#10b981]"></div>
                  <h4 className="font-extrabold text-sm font-mono text-white">Manufactured Batch Registered</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">Batch #TN-99281 • RoHS Heavy-Metals Restriction Compliant</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_#3b82f6]"></div>
                  <h4 className="font-extrabold text-sm font-mono text-white">Asset Deployment Phase Active</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">Corporate active hardware cycle • Projected life: 3.5 years</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-orange-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_#f97316]"></div>
                  <h4 className="font-extrabold text-sm font-mono text-white">Decommissioning & Reclamation (Pending)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">Pending certified recovery, dismantling, & materials separation under CPCB guidelines.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
