'use client';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const alerts = [
  { id: 1, text: "Violation detected in Sector 4: Illegal e-waste dumping.", type: "danger" },
  { id: 2, text: "New authorized recycler 'EcoCycle Solutions' added to the network.", type: "success" },
  { id: 3, text: "Monthly compliance report for Q2 is now available for download.", type: "info" },
  { id: 4, text: "AI Alert: Suspicious disposal pattern detected in Northern District.", type: "warning" },
  { id: 5, text: "Policy Update: New regulations for lithium-ion battery disposal.", type: "info" },
];

export default function AlertTicker() {
  return (
    <div className="bg-secondary dark:bg-black/40 border-y border-white/10 py-4 overflow-hidden flex whitespace-nowrap">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex gap-12"
      >
        {[...alerts, ...alerts].map((alert, i) => (
          <div key={i} className="flex items-center gap-3">
            {alert.type === 'danger' && <AlertCircle size={18} className="text-red-500" />}
            {alert.type === 'success' && <CheckCircle size={18} className="text-primary" />}
            {alert.type === 'info' && <Info size={18} className="text-blue-400" />}
            {alert.type === 'warning' && <AlertCircle size={18} className="text-yellow-500" />}
            <span className="text-white/80 font-medium text-sm">{alert.text}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mx-4"></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
