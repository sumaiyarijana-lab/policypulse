'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Map as MapIcon, 
  ShieldAlert, 
  Settings, 
  LogOut,
  AlertTriangle,
  Calculator,
  BookOpen,
  Trophy
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Complaints', icon: FileText, path: '/complaints' },
  { name: 'Live Map', icon: MapIcon, path: '/map' },
  { name: 'Compliance', icon: ShieldAlert, path: '/compliance' },
  { name: 'AI Detection', icon: AlertTriangle, path: '/ai-dashboard' },
  { name: 'Calculator', icon: Calculator, path: '/calculator' },
  { name: 'Education', icon: BookOpen, path: '/education' },
  { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-secondary text-white fixed left-0 top-0 flex flex-col border-r border-white/10 z-50">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-xl">P</div>
          <span className="text-xl font-bold tracking-tight">PolicyPulse</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-primary'} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
