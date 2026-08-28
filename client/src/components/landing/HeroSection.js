'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, AlertCircle, BarChart } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            AI-Powered Environmental Compliance
          </div>
          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6 dark:text-white">
            Protect Environment with <span className="text-primary">Smart E-Waste</span> Compliance
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
            Revolutionizing electronic waste management with real-time tracking, 
            automated violation detection, and citizen-powered monitoring.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/complaints" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary/30 flex items-center gap-2 group">
              Report Complaint <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/compliance" className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-primary text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2">
              Check Compliance
            </Link>
            <Link href="/map" className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              <AlertCircle size={20} /> View Live Violations
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
            <div className="flex items-center gap-2 font-bold text-gray-500"><ShieldCheck size={24} /> SOC2 Compliant</div>
            <div className="flex items-center gap-2 font-bold text-gray-500"><BarChart size={24} /> ISO 14001</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[600px] w-full"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="relative w-full h-full glass rounded-[40px] overflow-hidden border border-white/20 shadow-2xl">
            <Image 
              src="/images/hero-illustration.png" 
              alt="Environmental Tech Illustration" 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold">Real-time Node Monitoring</span>
                <span className="text-primary font-mono text-sm">ACTIVE</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-primary shadow-[0_0_10px_#16a34a]"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
