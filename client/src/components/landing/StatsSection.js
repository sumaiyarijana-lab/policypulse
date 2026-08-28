'use client';
import { motion } from 'framer-motion';
import { MessageSquare, ShieldAlert, Recycle, UserCheck } from 'lucide-react';

const stats = [
  { label: 'Total Complaints', value: '1,284', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Active Violations', value: '42', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
  { label: 'Recycled Devices', value: '15,420', icon: Recycle, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Authorized Recyclers', value: '89', icon: UserCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-white/2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <h3 className="text-4xl font-black mb-2 dark:text-white">{stat.value}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
