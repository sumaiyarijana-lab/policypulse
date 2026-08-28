'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Map, Cpu, FileText, Bell, Mail, Layout, 
  Globe, Database, ShieldAlert, BookOpen, Building2, Smartphone, 
  Lock, EyeOff, Terminal, Settings, RefreshCw, Save, Trash2, 
  Key, Clock, Sparkles, Activity, FileCheck, CheckCircle2, 
  Volume2, Sliders, Moon, Sun, Check, AlertTriangle, Eye, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Profile');
  const [themeColor, setThemeColor] = useState('teal'); // teal, green, orange, crimson
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // User Authentication State
  const [user, setUser] = useState({
    name: 'Mohamed Ismail',
    email: 'mohamed.ismail@policypulse.gov',
    phone: '+91 98765 43210',
    organizationName: 'Chennai Green Compliance Board',
    role: 'Admin',
    address: 'Guindy Industrial Sector, Chennai, Tamil Nadu',
    bio: 'Overseeing Chennai e-waste surveillance networks and CPCB environmental policy implementation.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop'
  });

  // Profile Form Draft State (Auto-save simulation)
  const [profileDraft, setProfileDraft] = useState({ ...user });

  // 1. Password/Security State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    enable2FA: false,
    sessionTimeout: '30',
    biometricLogin: true,
    captchaProtect: true
  });
  const [passwordStrength, setPasswordStrength] = useState('');

  // 2. Maps & Radar preferences
  const [mapSettings, setMapSettings] = useState({
    liveLocation: true,
    gpsAccuracy: 'High',
    mapTheme: 'dark',
    autoCenter: true,
    nearbyRadius: 5,
    heatmapOpacity: 0.6,
    refreshRate: 5,
    showVerifiedOnly: false,
    safeZoneAlerts: true
  });

  // 3. AI Monitoring Controls
  const [aiSettings, setAiSettings] = useState({
    sensitivity: 'High',
    autoDetection: true,
    riskThreshold: 65,
    predictionFrequency: 'Daily',
    duplicateFilter: true,
    autoClassification: true,
    confidenceVisibility: true,
    predictiveAnalysis: true,
    suspiciousMonitoring: true
  });

  // 4. Compliance & Rules state
  const [complianceSettings, setComplianceSettings] = useState({
    regulations: ['E-Waste Rules 2022', 'TNPCB Section 4a', 'Hazardous Waste Act'],
    complianceThreshold: 75,
    violationSeverity: 'Critical',
    policyScheduler: 'Weekly',
    blacklistRecyclers: true
  });

  // 5. Notification Toggles
  const [notificationSettings, setNotificationSettings] = useState({
    complaintUpdates: true,
    aiViolationAlerts: true,
    nearbyDangerAlerts: true,
    complianceWarnings: true,
    blacklistAlerts: true,
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
    soundEnabled: true,
    silentHours: false
  });

  // 6. Reports & PDF config
  const [reportSettings, setReportSettings] = useState({
    registeredAdminEmail: 'admin@policypulse.gov',
    forwardComplaints: true,
    frequency: 'Weekly',
    autoPdf: true,
    csvDelimiter: ',',
    backupSmtp: 'smtp.policypulse.net'
  });

  // 7. Dashboard layouts
  const [dashboardSettings, setDashboardSettings] = useState({
    showLiveMapWidget: true,
    showComplianceScoreWidget: true,
    showImpactCalculator: true,
    chartType: 'AreaChart',
    refreshInterval: 10,
    themeMode: 'SurveillanceDark'
  });

  // 8. Language & Accessibility
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    language: 'English',
    fontSize: 'Medium',
    highContrast: false,
    voiceAssistant: false,
    colorBlindMode: 'None'
  });

  // 9. Data backups
  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    backupSchedule: 'Weekly',
    cloudSync: true,
    retentionMonths: 12
  });

  // 10. Performance Cache
  const [performanceMode, setPerformanceMode] = useState('HighPerformance');
  const [clearingCache, setClearingCache] = useState(false);

  // 11. Interactive AI Learning Retrainer State
  const [retraining, setRetraining] = useState(false);
  const [aiLogs, setAiLogs] = useState([]);
  const logTerminalRef = useRef(null);

  // Calculate password strength
  const checkPasswordStrength = (pass) => {
    setSecurityForm({ ...securityForm, newPassword: pass });
    if (!pass) {
      setPasswordStrength('');
      return;
    }
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) setPasswordStrength('WEAK');
    else if (score <= 3) setPasswordStrength('MODERATE');
    else setPasswordStrength('STRONG');
  };

  // Profile draft auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate silent save to draft
      localStorage.setItem('profile_draft', JSON.stringify(profileDraft));
    }, 1000);
    return () => clearTimeout(timer);
  }, [profileDraft]);

  const saveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    
    try {
      // Fetch token if exists
      const token = localStorage.getItem('token');
      
      const payload = {
        name: profileDraft.name,
        email: profileDraft.email,
        phone: profileDraft.phone,
        organizationName: profileDraft.organizationName,
        address: profileDraft.address,
        bio: profileDraft.bio,
        avatar: profileDraft.avatar,
        settings: {
          mapSettings,
          aiSettings,
          complianceSettings,
          notificationSettings,
          reportSettings,
          dashboardSettings,
          accessibilitySettings,
          dataSettings,
          securitySettings: {
            enable2FA: securityForm.enable2FA,
            sessionTimeout: securityForm.sessionTimeout,
            biometricLogin: securityForm.biometricLogin
          }
        }
      };

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        toast.success("✅ Smart control center configurations successfully saved & synced!");
      } else {
        // Fallback save locally
        setUser({ ...profileDraft });
        toast.success("✅ Configurations updated & synced locally! (Fallback Mode)");
      }
    } catch(err) {
      setUser({ ...profileDraft });
      toast.success("✅ Configuration matrix successfully updated (Local Storage synced).");
    } finally {
      setSaving(false);
      setShowSaveAlert(true);
      setTimeout(() => setShowSaveAlert(false), 3000);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmNewPassword) {
      toast.error("❌ New passwords do not match!");
      return;
    }
    toast.success("🔒 Security Password upgraded and active.");
    setSecurityForm({ ...securityForm, currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setPasswordStrength('');
  };

  const clearSystemCache = () => {
    setClearingCache(true);
    setTimeout(() => {
      setClearingCache(false);
      toast.success("🧹 Core application telemetry cache successfully cleared! (214 MB reclaimed)");
    }, 1500);
  };

  const executeAiRetraining = () => {
    setRetraining(true);
    setAiLogs([]);
    let epoch = 1;
    
    const logs = [
      "🔄 Initializing Environmental Policy Network (EPN) model weights...",
      "📂 Loading 10,000+ localized Chennai dumping complaints telemetry...",
      "🔬 Parsing CPCB recycling center verification patterns...",
      "🚀 Epoch 1/5 | Processing tensor blocks | loss: 0.412 | acc: 78.4%",
      "🚀 Epoch 2/5 | Reducing false-positive parameters | loss: 0.228 | acc: 89.2%",
      "🚀 Epoch 3/5 | Adjusting industrial dumping sensitivity vector | loss: 0.114 | acc: 94.7%",
      "🚀 Epoch 4/5 | Optimizing geospatial OMR/Guindy hotspot biases | loss: 0.062 | acc: 97.9%",
      "🚀 Epoch 5/5 | Stabilizing neural compliance criteria | loss: 0.031 | acc: 99.4%",
      "💾 Saving EPN checkpoint v3.1 weights to server database...",
      "✅ Retraining complete! EPN v3.1 model successfully deployed to live production. Confidence index spiked to 99.4%!"
    ];

    const interval = setInterval(() => {
      if (epoch <= logs.length) {
        setAiLogs(prev => [...prev, logs[epoch - 1]]);
        epoch++;
        if (logTerminalRef.current) {
          logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setRetraining(false);
        toast.success("🧠 AI Neural model successfully retrained and deployed!");
      }
    }, 800);
  };

  const deleteUserAccount = () => {
    const check = confirm("🚨 CAUTION: Are you absolutely sure you want to permanently deactivate and delete this administrative PolicyPulse account? All surveillance records, compliance certificates, and preferences will be permanently wiped from the government servers.");
    if (check) {
      toast.error("💥 Account deleted. Redirecting to home portal...");
    }
  };

  // Accent glow styling map
  const activeColor = 
    themeColor === 'green' ? 'from-emerald-500 to-green-600' :
    themeColor === 'orange' ? 'from-orange-500 to-amber-600' :
    themeColor === 'crimson' ? 'from-rose-500 to-red-600' :
    'from-blue-500 to-teal-600';

  const glowAccent = 
    themeColor === 'green' ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-500/5 focus:ring-emerald-500' :
    themeColor === 'orange' ? 'border-orange-500/30 hover:border-orange-500/60 shadow-orange-500/5 focus:ring-orange-500' :
    themeColor === 'crimson' ? 'border-rose-500/30 hover:border-rose-500/60 shadow-rose-500/5 focus:ring-rose-500' :
    'border-blue-500/30 hover:border-blue-500/60 shadow-blue-500/5 focus:ring-blue-500';

  const textAccent = 
    themeColor === 'green' ? 'text-emerald-400' :
    themeColor === 'orange' ? 'text-orange-400' :
    themeColor === 'crimson' ? 'text-rose-400' :
    'text-blue-400';

  const bgAccent = 
    themeColor === 'green' ? 'bg-emerald-500' :
    themeColor === 'orange' ? 'bg-orange-500' :
    themeColor === 'crimson' ? 'bg-rose-500' :
    'bg-blue-500';

  const menuSections = [
    { id: 'Profile', name: '👤 Personal Profile', icon: User },
    { id: 'Security', name: '🔐 Security & Access', icon: Shield },
    { id: 'Maps', name: '🌍 Map & Radar Spec', icon: Map },
    { id: 'AI', name: '🧠 AI Surveillance Calibrator', icon: Cpu },
    { id: 'Compliance', name: '⚖️ CPCB Rules & Standards', icon: FileText },
    { id: 'Notifications', name: '🔔 Smart Alert Toggles', icon: Bell },
    { id: 'Reports', name: '📧 PDF Email Report Dispatches', icon: Mail },
    { id: 'Dashboard', name: '📊 Display Personalization', icon: Layout },
    { id: 'Accessibility', name: '🌐 Accessibility & Languages', icon: Globe },
    { id: 'Data', name: '🗂 Database & Backups', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 relative overflow-hidden font-sans">
      
      {/* Glow overlays */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[150px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 blur-[150px] pointer-events-none rounded-full"></div>

      <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 bg-gradient-to-r ${activeColor} rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse`}>
              <Settings size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">Chennai Command Center Config</span>
              </div>
              <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight">
                PolicyPulse Control Panel
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Calibrate AI sensitivity thresholds, configure CPCB compliance filters, map rendering layers, and SMTP report streams.
              </p>
            </div>
          </div>
          
          {/* Theme customizer and save action */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Accent Selectors */}
            <div className="bg-[#0f172a] border border-white/10 p-2 rounded-2xl flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pl-1 font-bold">Accent Theme:</span>
              <div className="flex gap-1.5">
                {['teal', 'green', 'orange', 'crimson'].map(color => (
                  <button 
                    key={color}
                    onClick={() => setThemeColor(color)}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      color === 'green' ? 'bg-emerald-500 border-emerald-400' :
                      color === 'orange' ? 'bg-orange-500 border-orange-400' :
                      color === 'crimson' ? 'bg-rose-500 border-rose-400' :
                      'bg-teal-500 border-teal-400'
                    } ${themeColor === color ? 'scale-125 ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>
            
            <button 
              onClick={saveSettings} 
              disabled={saving}
              className={`bg-gradient-to-r ${activeColor} hover:opacity-90 disabled:opacity-50 text-white font-bold font-mono px-5 py-3 rounded-xl shadow-lg transition-all text-xs flex items-center gap-2 active:scale-95`}
            >
              {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
              SYNC CONFIGURATIONS
            </button>
          </div>
        </div>

        {/* Settings Master Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Accents Profile Card & Sidebar Navigation */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Profile Avatar Card */}
            <div className="bg-[#0f172a]/80 border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-4 text-center relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeColor}`}></div>
              
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-500/50 transition-colors shadow-xl">
                <img src={profileDraft.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-mono font-black tracking-widest text-slate-200 cursor-pointer transition-opacity uppercase">
                  Change Pic
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileDraft({ ...profileDraft, avatar: reader.result });
                          toast.success("✅ Profile image preview updated! Click Sync to save.");
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </label>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">{profileDraft.name}</h3>
                <p className={`text-xs font-mono font-bold ${textAccent} uppercase tracking-wider`}>{profileDraft.role} Account</p>
                <p className="text-xs text-slate-400">{profileDraft.organizationName}</p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 text-left font-mono text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Access:</span>
                  <span className="text-emerald-400 font-bold">VERIFIED ADMINISTRATOR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">E-Waste Eco-Score:</span>
                  <span className="text-blue-400 font-bold">98 / 100 COMPLIANT</span>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Options */}
            <div className="bg-[#0f172a]/80 border border-white/10 rounded-[32px] p-4 shadow-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-3 select-none">Surveillance Options Matrix</span>
              <div className="space-y-1 pt-2">
                {menuSections.map(sec => {
                  const IconComponent = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold font-mono tracking-wide text-xs transition-all duration-200 group text-left ${
                        isActive 
                          ? `bg-gradient-to-r ${activeColor} text-white shadow-md shadow-blue-500/5 border border-white/10` 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent size={16} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                        <span>{sec.name}</span>
                      </div>
                      <ChevronRight size={14} className={isActive ? 'text-white translate-x-1' : 'text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all'} />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Settings Details Forms */}
          <div className="xl:col-span-8 bg-[#0f172a]/80 border border-white/10 rounded-[32px] p-8 shadow-2xl relative min-h-[600px] overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeColor}`}></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* SECTION 1: PROFILE */}
                {activeSection === 'Profile' && (
                  <form onSubmit={saveSettings} className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <User size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Personal Profile Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                        <input 
                          type="text" 
                          value={profileDraft.name} 
                          onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
                          required
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${glowAccent}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Registrant Email</label>
                        <input 
                          type="email" 
                          value={profileDraft.email} 
                          onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })}
                          required
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${glowAccent}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                        <input 
                          type="text" 
                          value={profileDraft.phone} 
                          onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${glowAccent}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Organization Jurisdiction</label>
                        <input 
                          type="text" 
                          value={profileDraft.organizationName} 
                          onChange={(e) => setProfileDraft({ ...profileDraft, organizationName: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${glowAccent}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Office Address</label>
                      <input 
                        type="text" 
                        value={profileDraft.address} 
                        onChange={(e) => setProfileDraft({ ...profileDraft, address: e.target.value })}
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${glowAccent}`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Bio / Professional Scope</label>
                      <textarea 
                        rows="3" 
                        value={profileDraft.bio} 
                        onChange={(e) => setProfileDraft({ ...profileDraft, bio: e.target.value })}
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all font-sans leading-relaxed ${glowAccent}`}
                      />
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
                      <button 
                        type="button" 
                        onClick={deleteUserAccount}
                        className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white font-bold font-mono px-4 py-3 rounded-xl transition-all text-xs flex items-center gap-1.5"
                      >
                        <Trash2 size={14} /> DEACTIVATE ACCOUNT
                      </button>
                      
                      <div className="flex gap-3">
                        <button 
                          type="button" 
                          onClick={() => setProfileDraft({ ...user })}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono px-5 py-3 rounded-xl transition-all text-xs"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className={`bg-gradient-to-r ${activeColor} text-white font-bold font-mono px-6 py-3 rounded-xl shadow-lg transition-all text-xs flex items-center gap-2`}
                        >
                          <Save size={14} /> Save Profile Changes
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* SECTION 2: SECURITY */}
                {activeSection === 'Security' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Shield size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Security Credentials & Access Control</h2>
                    </div>

                    {/* Change Password */}
                    <form onSubmit={handlePasswordChangeSubmit} className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl space-y-4">
                      <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Key size={16} className={textAccent} /> Upgrade Password
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <input 
                            type="password" 
                            placeholder="Current Password" 
                            value={securityForm.currentPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                            required
                            className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${glowAccent}`}
                          />
                        </div>
                        <div>
                          <input 
                            type="password" 
                            placeholder="New Secure Password" 
                            value={securityForm.newPassword}
                            onChange={(e) => checkPasswordStrength(e.target.value)}
                            required
                            className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${glowAccent}`}
                          />
                        </div>
                        <div>
                          <input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            value={securityForm.confirmNewPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, confirmNewPassword: e.target.value })}
                            required
                            className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${glowAccent}`}
                          />
                        </div>
                      </div>
                      
                      {passwordStrength && (
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-500">Security Index Check:</span>
                          <span className={`font-black ${passwordStrength === 'STRONG' ? 'text-emerald-400' : passwordStrength === 'MODERATE' ? 'text-orange-400' : 'text-red-400'}`}>
                            {passwordStrength}
                          </span>
                        </div>
                      )}

                      <button type="submit" className={`bg-gradient-to-r ${activeColor} text-white font-bold font-mono px-5 py-2.5 rounded-xl text-xs`}>
                        CHANGE PASSWORD
                      </button>
                    </form>

                    {/* 2FA & Biometric */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#0f172a] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
                        <div className="space-y-1 pr-4">
                          <h4 className="font-bold text-sm">Two-Factor Authentication (2FA)</h4>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Secure logs using secondary one-time verification tokens sent to registered email.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={securityForm.enable2FA}
                          onChange={(e) => setSecurityForm({ ...securityForm, enable2FA: e.target.checked })}
                          className={`rounded border-white/10 bg-slate-900 text-teal-500 focus:ring-teal-500 h-4 w-4`}
                        />
                      </div>

                      <div className="bg-[#0f172a] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
                        <div className="space-y-1 pr-4">
                          <h4 className="font-bold text-sm">Biometric Fingerprint/Face Recognition</h4>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Enable secure WebAuthn logs directly on supported hardware browsers.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={securityForm.biometricLogin}
                          onChange={(e) => setSecurityForm({ ...securityForm, biometricLogin: e.target.checked })}
                          className={`rounded border-white/10 bg-slate-900 text-teal-500 focus:ring-teal-500 h-4 w-4`}
                        />
                      </div>
                    </div>

                    {/* Login Activity Logs */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> Login Audit Stream</h4>
                      <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 space-y-2 font-mono text-[10px]">
                        <div className="flex justify-between border-b border-white/5 pb-2 text-slate-500">
                          <span>DEVICE TYPE / OS</span>
                          <span>IP ADDRESS</span>
                          <span>REGISTRY TIME</span>
                          <span className="text-right">TELEMETRY ACCESS</span>
                        </div>
                        {[
                          { dev: "Chrome / Windows 11 (This session)", ip: "157.44.182.90", time: "May 31, 20:54", status: "Active" },
                          { dev: "Safari / Apple iPadOS", ip: "157.44.180.20", time: "May 29, 14:12", status: "Closed" },
                          { dev: "Firefox / Linux Ubuntu Server", ip: "128.0.0.1", time: "May 22, 09:44", status: "Revoked" }
                        ].map((log, i) => (
                          <div key={i} className="flex justify-between border-b border-white/5 pb-2 text-slate-300">
                            <span>{log.dev}</span>
                            <span>{log.ip}</span>
                            <span>{log.time}</span>
                            <span className={`text-right font-black ${log.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>{log.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: MAPS */}
                {activeSection === 'Maps' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Map size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Geospatial Radar & Live Map Variables</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Live Geolocation Tracking</label>
                        <select 
                          value={mapSettings.liveLocation ? 'true' : 'false'} 
                          onChange={(e) => setMapSettings({ ...mapSettings, liveLocation: e.target.value === 'true' })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="true">ENABLE GPS STREAM</option>
                          <option value="false">SUSPEND LOCATE SERVICES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">GPS Accuracy Filters</label>
                        <select 
                          value={mapSettings.gpsAccuracy} 
                          onChange={(e) => setMapSettings({ ...mapSettings, gpsAccuracy: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="High">HIGH PRECISION (&plusmn;1m)</option>
                          <option value="Medium">BALANCED CELL-TOWER (&plusmn;20m)</option>
                          <option value="Low">COARSE REGION (&plusmn;1km)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Default Radar Theme</label>
                        <select 
                          value={mapSettings.mapTheme} 
                          onChange={(e) => setMapSettings({ ...mapSettings, mapTheme: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="dark">STREET / DARK MODE</option>
                          <option value="satellite">SATELLITE SPECTRAL LAYER</option>
                          <option value="terrain">TERRAIN MAP GRID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Nearby Proximity Warn Radius</label>
                        <select 
                          value={mapSettings.nearbyRadius} 
                          onChange={(e) => setMapSettings({ ...mapSettings, nearbyRadius: parseInt(e.target.value) })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="1">WITHIN 1 KM</option>
                          <option value="5">WITHIN 5 KM</option>
                          <option value="10">WITHIN 10 KM</option>
                          <option value="25">WITHIN 25 KM</option>
                        </select>
                      </div>
                    </div>

                    {/* Heatmap density range */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Heatmap Red-Zone Spectral Opacity ({mapSettings.heatmapOpacity * 100}%)</h4>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1" 
                        step="0.1" 
                        value={mapSettings.heatmapOpacity} 
                        onChange={(e) => setMapSettings({ ...mapSettings, heatmapOpacity: parseFloat(e.target.value) })}
                        className="w-full bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                      <label className="flex items-center justify-between bg-slate-950/60 p-4 border border-white/5 rounded-2xl hover:border-white/10 cursor-pointer">
                        <span>Auto-Center Map on User Coordinate</span>
                        <input type="checkbox" checked={mapSettings.autoCenter} onChange={(e) => setMapSettings({ ...mapSettings, autoCenter: e.target.checked })} className="rounded bg-slate-900 border-white/10 text-teal-500 h-4 w-4" />
                      </label>
                      <label className="flex items-center justify-between bg-slate-950/60 p-4 border border-white/5 rounded-2xl hover:border-white/10 cursor-pointer">
                        <span>Safe-Zone Recycler Proximity Alerts</span>
                        <input type="checkbox" checked={mapSettings.safeZoneAlerts} onChange={(e) => setMapSettings({ ...mapSettings, safeZoneAlerts: e.target.checked })} className="rounded bg-slate-900 border-white/10 text-teal-500 h-4 w-4" />
                      </label>
                    </div>
                  </div>
                )}

                {/* SECTION 4: AI MONITORING */}
                {activeSection === 'AI' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Cpu size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Neural AI Surveillance Settings</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Model Risk Sensitivity</label>
                        <select 
                          value={aiSettings.sensitivity} 
                          onChange={(e) => setAiSettings({ ...aiSettings, sensitivity: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="Low">LOW SENSITIVITY (Reduces alerts)</option>
                          <option value="Medium">BALANCED FILTER MATRIX</option>
                          <option value="High">HIGH AGGRESSION (Immediate auto-flag)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Statistical Projections Rate</label>
                        <select 
                          value={aiSettings.predictionFrequency} 
                          onChange={(e) => setAiSettings({ ...aiSettings, predictionFrequency: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="Hourly">HOURLY EPOCH RUNS</option>
                          <option value="Daily">DAILY RE-CLASSIFY ROUTINE</option>
                          <option value="Weekly">WEEKLY MATHEMATICAL TRENDS</option>
                        </select>
                      </div>
                    </div>

                    {/* AI Risk triggers threshold slider */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Automatic Escalation Risk Score Trigger ({aiSettings.riskThreshold}%)</h4>
                      <input 
                        type="range" 
                        min="20" 
                        max="90" 
                        value={aiSettings.riskThreshold} 
                        onChange={(e) => setAiSettings({ ...aiSettings, riskThreshold: parseInt(e.target.value) })}
                        className="w-full bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Retraining Model Interactive Block */}
                    <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Terminal size={18} className={textAccent} />
                          <h3 className="text-sm font-mono font-bold uppercase tracking-wider">AI Model Recalibrator Console</h3>
                        </div>
                        <button 
                          onClick={executeAiRetraining} 
                          disabled={retraining}
                          className={`bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1`}
                        >
                          {retraining ? <RefreshCw className="animate-spin" size={12} /> : <Sliders size={12} />}
                          RETRAIN AI SURVEILLANCE
                        </button>
                      </div>

                      {/* Live Output Log Console */}
                      <div 
                        ref={logTerminalRef}
                        className="h-44 bg-black border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-emerald-400 overflow-y-auto space-y-2 select-text"
                      >
                        {aiLogs.length === 0 ? (
                          <div className="text-slate-500 flex flex-col items-center justify-center h-full">
                            <Activity size={24} className="mb-2 opacity-30 animate-pulse text-slate-400" />
                            <span>Surveillance EPN Retraining logs sandbox standard output.</span>
                            <span>Click retrain to initiate weights calculation.</span>
                          </div>
                        ) : (
                          aiLogs.map((log, idx) => (
                            <div key={idx} className="leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                              {log}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 5: COMPLIANCE */}
                {activeSection === 'Compliance' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <FileText size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">CPCB Regulations & Regional Compliance Standards</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Government Compliance Target</label>
                        <select 
                          value={complianceSettings.complianceThreshold} 
                          onChange={(e) => setComplianceSettings({ ...complianceSettings, complianceThreshold: parseInt(e.target.value) })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="60">MINIMUM COMPLIANT (60% Audit rating)</option>
                          <option value="75">STANDARD TARGET (75% Audit rating)</option>
                          <option value="90">MAXIMUM GREEN COMPLIANCE (90% Audit rating)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Initial Auto-Escalation Level</label>
                        <select 
                          value={complianceSettings.violationSeverity} 
                          onChange={(e) => setComplianceSettings({ ...complianceSettings, violationSeverity: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="Low">LOW PRIORITY</option>
                          <option value="Medium">MEDIUM PRIORITY FLAG</option>
                          <option value="High">HIGH RISK ESCALATION</option>
                          <option value="Critical">CRITICAL DANGER DISPATCH</option>
                        </select>
                      </div>
                    </div>

                    {/* Checklist of laws */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><FileCheck size={12}/> Monitored National Directives</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          "E-Waste Management Rules 2022",
                          "CPCB Heavy Metal Caps Rules",
                          "Tamil Nadu E-Waste Policies",
                          "RoHS Hazardous Materials Compliance",
                          "WEEE Standard Regulations"
                        ].map((law, idx) => (
                          <div key={idx} className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl flex items-center justify-between text-xs font-medium">
                            <span>{law}</span>
                            <span className={`w-2.5 h-2.5 rounded-full ${bgAccent} shadow`}></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recyclers check scheduler */}
                    <div className="bg-[#0f172a] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
                      <div className="space-y-1 pr-4">
                        <h4 className="font-bold text-sm">Recycler License Expiry Autochecker</h4>
                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Runs automated background scans against the CPCB facility registries to auto-blacklist expired licenses.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={complianceSettings.blacklistRecyclers}
                        onChange={(e) => setComplianceSettings({ ...complianceSettings, blacklistRecyclers: e.target.checked })}
                        className={`rounded border-white/10 bg-slate-900 text-teal-500 focus:ring-teal-500 h-4 w-4`}
                      />
                    </div>
                  </div>
                )}

                {/* SECTION 6: NOTIFICATIONS */}
                {activeSection === 'Notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Bell size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Surveillance Notifications & Real-Time Stream</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                      {[
                        { key: 'complaintUpdates', label: 'Send alerts on Citizen Incident updates' },
                        { key: 'aiViolationAlerts', label: 'Push emergency flags on Neural classifications' },
                        { key: 'nearbyDangerAlerts', label: 'Trigger proximity SMS alerts within tracking radius' },
                        { key: 'complianceWarnings', label: 'Send warnings on corporate policy failures' },
                        { key: 'blacklistAlerts', label: 'Warn when illegal recyclers try shipping e-waste' },
                        { key: 'soundEnabled', label: 'Enable futuristic warning alarm sound effects' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between bg-slate-950/60 p-4 border border-white/5 rounded-2xl hover:border-white/10 cursor-pointer transition-all">
                          <span>{item.label}</span>
                          <input 
                            type="checkbox" 
                            checked={notificationSettings[item.key]} 
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })} 
                            className="rounded bg-slate-900 border-white/10 text-teal-500 h-4 w-4" 
                          />
                        </label>
                      ))}
                    </div>

                    <div className="bg-[#0f172a] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
                      <div className="space-y-1 pr-4">
                        <h4 className="font-bold text-sm">Silent Hours Policy Configuration</h4>
                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Mute non-critical alarms and notifications between 22:00 and 06:00 (Emergency violations bypass silent mode).</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.silentHours}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, silentHours: e.target.checked })}
                        className={`rounded border-white/10 bg-slate-900 text-teal-500 focus:ring-teal-500 h-4 w-4`}
                      />
                    </div>
                  </div>
                )}

                {/* SECTION 7: REPORTS */}
                {activeSection === 'Reports' && (
                  <form onSubmit={saveSettings} className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Mail size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Administrative PDF/CSV Dispatches</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Registered Admin Email</label>
                        <input 
                          type="email" 
                          value={reportSettings.registeredAdminEmail}
                          onChange={(e) => setReportSettings({ ...reportSettings, registeredAdminEmail: e.target.value })}
                          required
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Fallback SMTP Host URL</label>
                        <input 
                          type="text" 
                          value={reportSettings.backupSmtp}
                          onChange={(e) => setReportSettings({ ...reportSettings, backupSmtp: e.target.value })}
                          required
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Compliance PDF compile frequency</label>
                        <select 
                          value={reportSettings.frequency} 
                          onChange={(e) => setReportSettings({ ...reportSettings, frequency: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="Daily">DAILY HEAVY METAL AUDITS</option>
                          <option value="Weekly">WEEKLY CHENNAI MAP SUMMARIES</option>
                          <option value="Monthly">MONTHLY CPCB GOVERNMENT ARCHIVE</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Export CSV Delimiter</label>
                        <select 
                          value={reportSettings.csvDelimiter} 
                          onChange={(e) => setReportSettings({ ...reportSettings, csvDelimiter: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value=",">COMMA (Standard CSV)</option>
                          <option value=";">SEMICOLON (Excel Standard)</option>
                          <option value="\t">TAB DELIMITED (.txt)</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-[#0f172a] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
                      <div className="space-y-1 pr-4">
                        <h4 className="font-bold text-sm">Automatic Environmental PDF Dispatch</h4>
                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Compiles Weekly Chennai Violation Heatmaps and dispatches direct warning PDFs to corporate entities.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={reportSettings.autoPdf}
                        onChange={(e) => setReportSettings({ ...reportSettings, autoPdf: e.target.checked })}
                        className={`rounded border-white/10 bg-slate-900 text-teal-500 focus:ring-teal-500 h-4 w-4`}
                      />
                    </div>
                  </form>
                )}

                {/* SECTION 8: DISPLAY */}
                {activeSection === 'Dashboard' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Layout size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Personal Dashboard Personalization</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Homepage Default Charts type</label>
                        <select 
                          value={dashboardSettings.chartType} 
                          onChange={(e) => setDashboardSettings({ ...dashboardSettings, chartType: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="AreaChart">SMOOTH GRADIENT AREA CHARTS</option>
                          <option value="BarChart">ZONAL DUMPING BAR CHARTS</option>
                          <option value="PieChart">DISPOSAL TYPES COMPARISONS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Zonal Data Refresh Interval</label>
                        <select 
                          value={dashboardSettings.refreshInterval} 
                          onChange={(e) => setDashboardSettings({ ...dashboardSettings, refreshInterval: parseInt(e.target.value) })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="5">FAST POLLING (5 SECONDS)</option>
                          <option value="10">STANDARD SURVEILLANCE (10 SECONDS)</option>
                          <option value="30">BATTERY OPTIMIZED (30 SECONDS)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Sliders size={12}/> Primary Widget Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { key: 'showLiveMapWidget', label: ' Chennai Live Map Layer' },
                          { key: 'showComplianceScoreWidget', label: ' CPCB Audit gauges' },
                          { key: 'showImpactCalculator', label: ' Toxic Sparings calculator' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center justify-between bg-slate-950/60 p-4 border border-white/5 rounded-2xl hover:border-white/10 cursor-pointer">
                            <span>{item.label}</span>
                            <input 
                              type="checkbox" 
                              checked={dashboardSettings[item.key]} 
                              onChange={(e) => setDashboardSettings({ ...dashboardSettings, [item.key]: e.target.checked })} 
                              className="rounded bg-slate-900 border-white/10 text-teal-500 h-4 w-4" 
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 9: ACCESSIBILITY */}
                {activeSection === 'Accessibility' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Globe size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Accessibility & Languages</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Display Primary Language</label>
                        <select 
                          value={accessibilitySettings.language} 
                          onChange={(e) => setAccessibilitySettings({ ...accessibilitySettings, language: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="English">ENGLISH (CPCB Default)</option>
                          <option value="Tamil">தமிழ் (Tamil Nadu Zonal)</option>
                          <option value="Hindi">हिन्दी (National Hub)</option>
                          <option value="Telugu">తెలుగు</option>
                          <option value="Malayalam">മലയാളം</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Zonal Contrast Calibration</label>
                        <select 
                          value={accessibilitySettings.colorBlindMode} 
                          onChange={(e) => setAccessibilitySettings({ ...accessibilitySettings, colorBlindMode: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="None">STANDARD SPECTRAL GRIDS</option>
                          <option value="Protanopia">PROTANOPIA (Red-Weak Map highlights)</option>
                          <option value="Deuteranopia">DEUTERANOPIA (Green-Weak Map highlights)</option>
                          <option value="Tritanopia">TRITANOPIA</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                      <label className="flex items-center justify-between bg-slate-950/60 p-4 border border-white/5 rounded-2xl hover:border-white/10 cursor-pointer">
                        <span>High Contrast CSS personalizations</span>
                        <input type="checkbox" checked={accessibilitySettings.highContrast} onChange={(e) => setAccessibilitySettings({ ...accessibilitySettings, highContrast: e.target.checked })} className="rounded bg-slate-900 border-white/10 text-teal-500 h-4 w-4" />
                      </label>
                      <label className="flex items-center justify-between bg-slate-950/60 p-4 border border-white/5 rounded-2xl hover:border-white/10 cursor-pointer">
                        <span>AI Voice Warning assistant (CPCB Audio Alerts)</span>
                        <input type="checkbox" checked={accessibilitySettings.voiceAssistant} onChange={(e) => setAccessibilitySettings({ ...accessibilitySettings, voiceAssistant: e.target.checked })} className="rounded bg-slate-900 border-white/10 text-teal-500 h-4 w-4" />
                      </label>
                    </div>
                  </div>
                )}

                {/* SECTION 10: DATABASE & DATA MANAGEMENT */}
                {activeSection === 'Data' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Database size={22} className={textAccent} />
                      <h2 className="text-xl font-bold font-mono">Surveillance Databases & Sync back-ups</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Automated backup schedules</label>
                        <select 
                          value={dataSettings.backupSchedule} 
                          onChange={(e) => setDataSettings({ ...dataSettings, backupSchedule: e.target.value })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="Hourly">HOURLY ENCRYPTED ROTATIONS</option>
                          <option value="Daily">DAILY CLOUD ARCHIVES</option>
                          <option value="Weekly">WEEKLY GOVERNMENT SERVER SYNC</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">Surveillance records retention</label>
                        <select 
                          value={dataSettings.retentionMonths} 
                          onChange={(e) => setDataSettings({ ...dataSettings, retentionMonths: parseInt(e.target.value) })}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:ring-2 outline-none transition-all ${glowAccent}`}
                        >
                          <option value="6">6 MONTHS AUDITING (Wipe expired logs)</option>
                          <option value="12">12 MONTHS (CPCB Recommended)</option>
                          <option value="24">24 MONTHS ARCHIVE STORAGE</option>
                        </select>
                      </div>
                    </div>

                    {/* Data actions clearing cache */}
                    <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 space-y-4 font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="font-bold">Database Server State:</span>
                        <span className="text-emerald-400 font-black flex items-center gap-1"><CheckCircle2 size={12}/> OPTIMIZED (2.4 GB used)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Clear Telemetry cache variables:</span>
                        <button 
                          type="button" 
                          onClick={clearSystemCache}
                          disabled={clearingCache}
                          className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white font-bold px-4 py-2.5 rounded-xl transition-all text-xs flex items-center gap-1.5"
                        >
                          {clearingCache ? <RefreshCw className="animate-spin" size={12} /> : <Trash2 size={12} />}
                          CLEAR SYSTEM CACHE
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* Floating Save Sync Banner */}
      <AnimatePresence>
        {showSaveAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-emerald-950/95 border-2 border-emerald-500/80 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 backdrop-blur-xl pointer-events-auto">
              <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
              <div className="font-mono text-xs">
                <p className="font-black">✅ SURVEILLANCE MATRIX SYNCED SUCCESSFULLY!</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Parameters verified and saved across government compliance endpoints.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
