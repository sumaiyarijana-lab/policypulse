'use client';
import { Bell, Search, Sun, Moon, User, Globe } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="h-20 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-secondary/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-xl w-96">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search records, policies..." 
          className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder-gray-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button 
          onClick={toggleLanguage}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2 font-bold text-sm"
        >
          <Globe size={20} />
          <span className="uppercase">{language}</span>
        </button>

        <button className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-secondary"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">Mohamed Ismail</p>
            <p className="text-xs text-gray-500 mt-1">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
