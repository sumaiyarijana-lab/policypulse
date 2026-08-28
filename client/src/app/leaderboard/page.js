'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Search, Filter, ChevronRight } from 'lucide-react';

const mockLeaderboard = [
  { id: 1, name: 'EcoTech Recycling Solutions', type: 'Recycler', points: 15420, trend: 'up', location: 'New York, USA' },
  { id: 2, name: 'Global Renewables Inc.', type: 'Corporate', points: 14200, trend: 'up', location: 'London, UK' },
  { id: 3, name: 'GreenWaste Management', type: 'Recycler', points: 12850, trend: 'down', location: 'Berlin, DE' },
  { id: 4, name: 'SustainElectronics Corp', type: 'Producer', points: 11040, trend: 'up', location: 'Tokyo, JP' },
  { id: 5, name: 'EarthFirst IT Disposals', type: 'Recycler', points: 9500, trend: 'up', location: 'Toronto, CA' },
  { id: 6, name: 'Nexus Clean Energy', type: 'Corporate', points: 8800, trend: 'down', location: 'Sydney, AU' },
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredData = mockLeaderboard.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || org.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="w-16 h-16 bg-yellow-500/20 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
          <Trophy size={32} />
        </div>
        <h1 className="text-4xl font-black dark:text-white mb-4">Global Sustainability Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Recognizing the top organizations worldwide leading the charge in e-waste compliance and safe recycling practices.
        </p>
      </motion.div>

      {/* Top 3 Podium */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 pt-10">
        {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((org, index) => {
          const isFirst = index === 1;
          const isSecond = index === 0;
          const height = isFirst ? 'h-48' : isSecond ? 'h-40' : 'h-32';
          const bg = isFirst ? 'bg-yellow-400' : isSecond ? 'bg-gray-300' : 'bg-orange-400';
          const rank = isFirst ? 1 : isSecond ? 2 : 3;
          
          return (
            <motion.div 
              key={org.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center w-full md:w-64"
            >
              <div className="bg-white dark:bg-secondary/80 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-4 rounded-2xl shadow-xl w-full text-center mb-4 relative z-10 hover:-translate-y-2 transition-transform">
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full ${bg} border-4 border-white dark:border-secondary flex items-center justify-center text-white font-black shadow-lg`}>
                  {rank}
                </div>
                <h3 className="font-bold dark:text-white mt-4 truncate">{org.name}</h3>
                <p className="text-xs text-gray-500 font-medium mb-2">{org.type}</p>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-black inline-block">
                  {org.points.toLocaleString()} pts
                </div>
              </div>
              <div className={`w-full ${height} bg-gradient-to-t from-primary/20 to-primary/5 rounded-t-3xl border-t border-primary/20 hidden md:block`}></div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center bg-white dark:bg-white/5 rounded-xl px-4 py-2 w-full md:w-96 shadow-sm border border-gray-100 dark:border-white/10">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search organizations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:ring-0 ml-2 w-full text-sm dark:text-white outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
          >
            <option value="All">All Types</option>
            <option value="Recycler">Recycler</option>
            <option value="Corporate">Corporate</option>
            <option value="Producer">Producer</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-secondary/80 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400">
              <th className="p-4 font-semibold">Rank</th>
              <th className="p-4 font-semibold">Organization</th>
              <th className="p-4 font-semibold hidden md:table-cell">Type</th>
              <th className="p-4 font-semibold hidden sm:table-cell">Location</th>
              <th className="p-4 font-semibold">Points</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((org, index) => (
              <tr key={org.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <span className="font-bold text-gray-500 dark:text-gray-400 w-6 inline-block text-center">{mockLeaderboard.findIndex(o => o.id === org.id) + 1}</span>
                </td>
                <td className="p-4 font-bold dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs uppercase">
                    {org.name.substring(0,2)}
                  </div>
                  {org.name}
                </td>
                <td className="p-4 hidden md:table-cell text-sm text-gray-500">{org.type}</td>
                <td className="p-4 hidden sm:table-cell text-sm text-gray-500">{org.location}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" />
                    <span className="font-bold dark:text-white">{org.points.toLocaleString()}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500">No organizations found matching your criteria.</div>
        )}
      </div>
    </div>
  );
}
