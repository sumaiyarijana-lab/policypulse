'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, UploadCloud, AlertCircle, CheckCircle, 
  RefreshCw, Save, Send, Calendar, Navigation, X, Mic, MicOff
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ComplaintRegistrationPage() {
  const { user } = useAuth();
  
  const initialFormState = {
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    area: '',
    district: '',
    state: '',
    complaintType: '',
    title: '',
    description: '',
    lat: '',
    lng: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef(null);

  // Auto populate Date & Time
  const [currentDate, setCurrentDate] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleString());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setFormData(prev => ({ ...prev, description: (prev.description + ' ' + transcript).trim() }));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (evidence.length + newFiles.length > 5) {
        setStatus({ type: 'error', message: 'Maximum 5 files allowed.' });
        return;
      }
      setEvidence([...evidence, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const detectLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error(error);
          setStatus({ type: 'error', message: 'Failed to detect location. Please check permissions.' });
          setLocationLoading(false);
        }
      );
    } else {
      setStatus({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      setLocationLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setEvidence([]);
    setStatus({ type: '', message: '' });
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveDraft = () => {
    localStorage.setItem('complaintDraft', JSON.stringify(formData));
    setStatus({ type: 'success', message: 'Draft saved successfully!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  useEffect(() => {
    const draft = localStorage.getItem('complaintDraft');
    if (draft) {
      setTimeout(() => setFormData(JSON.parse(draft)), 0);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    evidence.forEach((file) => {
      submitData.append('evidence', file);
    });

    try {
      // Assuming we have token
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers,
        body: submitData
      });

      const data = await res.json();
      if (res.ok) {
        setComplaintId(data.complaint.complaintId);
        setShowSuccessPopup(true);
        handleReset();
        localStorage.removeItem('complaintDraft');
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to submit complaint.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Register a Complaint</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Help us protect the environment by reporting illegal e-waste dumping and non-compliant organizations.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/complaints/track" className="px-6 py-2 bg-secondary text-white rounded-xl font-bold border border-white/10 hover:bg-secondary/80 transition-all shadow-lg shadow-black/20">
            Track Existing Complaint Status
          </Link>
        </div>
      </motion.div>

      {/* Main Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[32px] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
      >
        {status.message && (
          <div className={`px-6 py-4 border-b ${
            status.type === 'error' 
              ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400' 
              : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400'
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              {status.message}
            </div>
          </div>
        )}

        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section 1: User Details */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none" />
                </div>
              </div>
            </section>

            {/* Section 2: Location */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</span>
                  Location Information
                </h3>
                <button type="button" onClick={detectLocation} disabled={locationLoading} className="text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-500/20 transition-colors">
                  {locationLoading ? <RefreshCw className="animate-spin" size={16} /> : <Navigation size={16} />}
                  Auto Detect GPS
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Area / Street *</label>
                  <input type="text" name="area" required value={formData.area} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">District *</label>
                  <input type="text" name="district" required value={formData.district} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State *</label>
                  <input type="text" name="state" required value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none" />
                </div>
                {(formData.lat && formData.lng) && (
                  <div className="col-span-1 md:col-span-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-blue-200 dark:border-blue-800/30">
                    <MapPin size={18} /> GPS Coordinates captured: {formData.lat}, {formData.lng}
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Complaint Details */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">3</span>
                Complaint Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complaint Type *</label>
                  <select name="complaintType" required value={formData.complaintType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none">
                    <option value="">Select Type</option>
                    <option value="Illegal Dumping">Illegal Dumping</option>
                    <option value="Unauthorized Recycling">Unauthorized Recycling Facility</option>
                    <option value="Improper Disposal">Improper Disposal</option>
                    <option value="Hazardous Leakage">Hazardous Leakage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complaint Title *</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Brief summary" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none" />
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Description *</label>
                  <button 
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                    }`}
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    {isListening ? 'Listening...' : 'Voice Input'}
                  </button>
                </div>
                <textarea name="description" required rows="5" value={formData.description} onChange={handleChange} placeholder="Provide as much detail as possible... (You can use the voice input for convenience)" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm dark:text-white transition-all outline-none"></textarea>
              </div>

              {/* File Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evidence Images/Videos (Max 5)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-white/10 border-dashed rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/40 transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-bold text-primary hover:text-primary/80 focus-within:outline-none">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} ref={fileInputRef} accept="image/*,video/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, MP4 up to 10MB each</p>
                  </div>
                </div>
                {evidence.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {evidence.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg text-sm dark:text-gray-300">
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700"><X size={16}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Info Footer */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={16} /> Auto-captured timestamp: <span className="font-mono">{currentDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button type="submit" disabled={loading} className="w-full sm:w-auto flex-1 flex justify-center items-center gap-2 py-4 px-8 border border-transparent rounded-xl shadow-xl shadow-primary/30 text-base font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100">
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
              <button type="button" onClick={handleSaveDraft} className="w-full sm:w-auto flex justify-center items-center gap-2 py-4 px-8 border border-gray-200 dark:border-white/10 rounded-xl text-base font-bold text-gray-700 dark:text-white bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                <Save size={20} /> Save Draft
              </button>
              <button type="button" onClick={handleReset} className="w-full sm:w-auto flex justify-center items-center gap-2 py-4 px-8 border border-red-200 dark:border-red-500/20 rounded-xl text-base font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Success Popup Modal */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-secondary rounded-[32px] shadow-2xl max-w-md w-full p-8 text-center border border-gray-100 dark:border-white/10"
            >
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Complaint Registered!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your complaint has been successfully recorded and sent to the environmental authorities.
              </p>
              <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Complaint Reference ID</p>
                <p className="text-2xl font-mono font-bold text-primary">{complaintId}</p>
              </div>
              <button 
                onClick={() => setShowSuccessPopup(false)}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
