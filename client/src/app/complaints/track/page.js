'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, AlertCircle, FileText, Download } from 'lucide-react';
import Link from 'next/link';

export default function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!complaintId.trim()) return;
    setLoading(true);

    // Mock API Call
    setTimeout(() => {
      setResult({
        id: complaintId.toUpperCase(),
        status: 'In Progress',
        date: new Date().toLocaleDateString(),
        type: 'Illegal Dumping',
        location: 'Downtown District',
        timeline: [
          { date: 'Oct 12, 2026', time: '09:00 AM', event: 'Complaint Registered successfully.', active: false },
          { date: 'Oct 13, 2026', time: '10:30 AM', event: 'Assigned to Investigation Officer.', active: false },
          { date: 'Oct 15, 2026', time: '14:45 PM', event: 'Site inspected. Evidence collected.', active: true },
          { date: 'Pending', time: '-', event: 'Awaiting final resolution.', active: false }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const generatePDF = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center print:hidden"
      >
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Track Your Complaint</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enter your Reference ID to check the real-time status of your report.
        </p>
      </motion.div>

      <div className="flex justify-center mb-10 print:hidden">
        <form onSubmit={handleTrack} className="w-full max-w-2xl flex items-center bg-white dark:bg-white/5 rounded-2xl p-2 shadow-xl border border-gray-100 dark:border-white/10 backdrop-blur-xl">
          <div className="p-3 text-gray-400">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Enter Complaint ID (e.g. COMP-1024)" 
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="flex-1 bg-transparent border-none px-2 focus:ring-0 text-lg dark:text-white outline-none placeholder-gray-400"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-secondary/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-white/10 pb-8 mb-8">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Complaint Reference</p>
              <h2 className="text-4xl font-black text-primary font-mono">{result.id}</h2>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 rounded-lg font-bold text-sm flex items-center gap-2">
                <Clock size={16} />
                {result.status}
              </span>
              <button 
                onClick={generatePDF}
                className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors print:hidden"
              >
                <Download size={16} /> Download Report PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                <Calendar size={20} />
                <span className="font-medium">Date Filed</span>
              </div>
              <p className="text-xl font-bold dark:text-white">{result.date}</p>
            </div>
            <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                <AlertCircle size={20} />
                <span className="font-medium">Type</span>
              </div>
              <p className="text-xl font-bold dark:text-white">{result.type}</p>
            </div>
            <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                <MapPin size={20} />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-xl font-bold dark:text-white">{result.location}</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-3">
              <FileText className="text-primary" /> Tracking Timeline
            </h3>
            <div className="relative pl-6 border-l-2 border-gray-200 dark:border-white/10 space-y-8">
              {result.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[33px] w-4 h-4 rounded-full border-4 ${
                    item.active 
                      ? 'bg-primary border-primary/20 shadow-[0_0_0_4px_rgba(29,158,117,0.2)]' 
                      : idx < result.timeline.findIndex(t => t.active) 
                        ? 'bg-primary border-primary' 
                        : 'bg-gray-300 dark:bg-gray-600 border-white dark:border-secondary'
                  }`}></div>
                  <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5 ml-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-bold ${item.active ? 'text-primary' : 'dark:text-white'}`}>{item.event}</span>
                      <span className="text-sm font-mono text-gray-500">{item.date} {item.time !== '-' && `• ${item.time}`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-8 text-center print:hidden">
        <Link href="/complaints" className="text-primary font-bold hover:underline">
          &larr; Back to Register Complaint
        </Link>
      </div>
    </div>
  );
}
