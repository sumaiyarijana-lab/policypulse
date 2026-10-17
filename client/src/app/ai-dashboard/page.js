'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, ShieldAlert, Cpu, AlertTriangle, CheckCircle, 
  TrendingUp, Database, Zap, FileText, Settings, RefreshCw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { toast, Toaster } from 'react-hot-toast';
import { AI_BASE_URL } from '@/config/api';

export default function AIDashboard() {
  const [formData, setFormData] = useState({
    quantity: '',
    is_authorized: 'false',
    complaintType: 'Illegal Dumping',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${AI_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: formData.quantity || 0,
          is_authorized: formData.is_authorized,
          complaintType: formData.complaintType,
          description: formData.description
        })
      });
      if (!res.ok) throw new Error("Flask service error status");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.warn('⚠️ AI microservice offline. Running high-fidelity local simulation.');
      const qty = parseInt(formData.quantity) || 0;
      const isAuth = formData.is_authorized === 'true';
      let score = 15;
      const alerts = [];
      const actions = [];
      
      if (!isAuth) {
        score += 35;
        alerts.push("CRITICAL: Recycler License ID verification mismatch.");
      }
      if (qty > 100 && !isAuth) {
        score += 45;
        alerts.push("CRITICAL: Large-scale e-waste transfer to unauthorized recycler detected.");
        actions.push("Halt recycling transfer immediately and freeze corporate license.");
      } else if (qty > 10) {
        score += 15;
      }
      
      const desc = (formData.description || '').toLowerCase();
      if (desc.includes('toxic') || desc.includes('leak') || desc.includes('acid') || desc.includes('burn') || desc.includes('river')) {
        score += 25;
        alerts.push("HAZARD FLAG: Dangerous chemical hazard or burning activity identified from textual analysis.");
        actions.push("Dispatch Chennai Pollution Control Board (TNPCB) field inspector to assess hazard impact.");
      }
      
      score = Math.min(100, Math.max(5, score));
      
      const classification = score >= 75 ? "CRITICAL RISK" :
                             score >= 50 ? "HIGH RISK" :
                             score >= 30 ? "MEDIUM RISK" : "LOW RISK";
                             
      const trend = [];
      for (let i = 0; i < 6; i++) {
        trend.push(Math.min(100, Math.max(0, score + (i * 3) + Math.floor(Math.random() * 15 - 7))));
      }
      
      setResult({
        risk_score: score,
        classification: classification,
        alerts: alerts,
        suggested_actions: actions.length > 0 ? actions : ["Maintain standard monitoring", "Perform routine audits."],
        violation_probability_trend: trend,
        is_violation: score >= 50
      });
      toast.warn("AI service offline. Displaying local simulated metrics.");
    } finally {
      setLoading(false);
    }
  };

  const trendData = result?.violation_probability_trend?.map((val, idx) => ({
    time: `T-${5-idx}`,
    probability: val
  })) || [];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 relative overflow-hidden font-sans">
      <Toaster />
      {/* Background Futuristic Grid */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[150px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 blur-[150px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-4 border-b border-white/10 pb-6"
        >
          <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/50 rounded-2xl flex items-center justify-center text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Cpu size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
              Nexus AI Detection Core
            </h1>
            <p className="text-blue-200/60 font-mono text-sm mt-1 flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" /> Neural Policy Engine v2.4 Active
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Input Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Database size={20} className="text-blue-400" /> Data Ingestion
              </h2>
              
              <form onSubmit={handleAnalyze} className="space-y-5">
                <div>
                  <label className="block text-sm font-mono text-blue-200/70 mb-2 uppercase tracking-wider">Device Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono transition-all" placeholder="e.g. 1500" />
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-blue-200/70 mb-2 uppercase tracking-wider">Authorization Status</label>
                  <select name="is_authorized" value={formData.is_authorized} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono transition-all">
                    <option value="true">Authorized Entity</option>
                    <option value="false">Unregistered Entity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-mono text-blue-200/70 mb-2 uppercase tracking-wider">Disposal Type</label>
                  <select name="complaintType" value={formData.complaintType} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono transition-all">
                    <option value="Illegal Dumping">Illegal Dumping</option>
                    <option value="Hazardous Leakage">Hazardous Leakage</option>
                    <option value="Improper Disposal">Improper Disposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-mono text-blue-200/70 mb-2 uppercase tracking-wider">Incident Details</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono transition-all" placeholder="Describe the scene (e.g. toxic liquid leaking near river...)"></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex justify-center items-center gap-2">
                  {loading ? <RefreshCw className="animate-spin" size={20} /> : <Activity size={20} />}
                  {loading ? 'Processing Neural Graph...' : 'Initiate AI Analysis'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Panel: Results Dashboard */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            {result ? (
              <>
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Risk Score */}
                  <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className={`absolute top-0 w-full h-1 ${result.risk_score >= 80 ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' : result.risk_score >= 50 ? 'bg-yellow-500 shadow-[0_0_20px_#eab308]' : 'bg-green-500 shadow-[0_0_20px_#22c55e]'}`}></div>
                    <span className="text-sm font-mono text-gray-400 mb-2 uppercase tracking-widest">AI Risk Score</span>
                    <div className="relative flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                        <motion.circle 
                          initial={{ strokeDasharray: "0 1000" }}
                          animate={{ strokeDasharray: `${(result.risk_score / 100) * 351.85} 351.85` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                          className={`${result.risk_score >= 80 ? 'text-red-500' : result.risk_score >= 50 ? 'text-yellow-500' : 'text-green-500'}`}
                        />
                      </svg>
                      <div className="absolute text-3xl font-black">{result.risk_score}</div>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl flex flex-col items-center justify-center">
                    <span className="text-sm font-mono text-gray-400 mb-4 uppercase tracking-widest">Classification</span>
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${result.risk_score >= 80 ? 'bg-red-500/20 text-red-500 shadow-red-500/30' : result.risk_score >= 50 ? 'bg-yellow-500/20 text-yellow-500 shadow-yellow-500/30' : 'bg-green-500/20 text-green-500 shadow-green-500/30'}`}>
                      {result.risk_score >= 80 ? <ShieldAlert size={40} /> : result.risk_score >= 50 ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
                    </div>
                    <h3 className={`text-xl font-black tracking-widest ${result.risk_score >= 80 ? 'text-red-500' : result.risk_score >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {result.classification}
                    </h3>
                  </div>

                  {/* Violation Flag */}
                  <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl flex flex-col items-center justify-center">
                    <span className="text-sm font-mono text-gray-400 mb-4 uppercase tracking-widest">Auto-Flag Status</span>
                    {result.is_violation ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <AlertTriangle size={48} className="text-red-500 mb-3" />
                        <span className="text-red-500 font-bold bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">VIOLATION DETECTED</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <CheckCircle size={48} className="text-green-500 mb-3" />
                        <span className="text-green-500 font-bold bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">NO VIOLATION</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Probability Chart */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-purple-400" /> Violation Probability Trend
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace'}} />
                        <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace'}} domain={[0, 100]} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="probability" stroke="#c084fc" strokeWidth={3} fillOpacity={1} fill="url(#colorProb)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Actionable Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alerts */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-6">
                    <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                      <ShieldAlert size={20} /> High-Risk Alerts ({result.alerts.length})
                    </h3>
                    {result.alerts.length > 0 ? (
                      <ul className="space-y-3">
                        {result.alerts.map((alert, i) => (
                          <li key={i} className="flex items-start gap-3 bg-red-500/10 p-3 rounded-xl border border-red-500/10 text-red-200 text-sm">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" />
                            {alert}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm font-mono">No critical alerts detected.</p>
                    )}
                  </div>

                  {/* Suggested Actions */}
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-[32px] p-6">
                    <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                      <FileText size={20} /> Suggested Actions ({result.suggested_actions.length})
                    </h3>
                    {result.suggested_actions.length > 0 ? (
                      <ul className="space-y-3">
                        {result.suggested_actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-3 bg-blue-500/10 p-3 rounded-xl border border-blue-500/10 text-blue-200 text-sm">
                            <Settings size={16} className="mt-0.5 shrink-0 text-blue-400" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm font-mono">No immediate actions required.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[32px] text-gray-500">
                <Cpu size={64} className="mb-4 opacity-20" />
                <p className="text-xl font-mono uppercase tracking-widest">Awaiting Data Input</p>
                <p className="text-sm mt-2">Enter parameters on the left to initiate neural analysis.</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
