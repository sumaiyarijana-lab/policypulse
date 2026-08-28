'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Monitor, Smartphone, Battery, TreePine, Zap, ShieldAlert, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ImpactCalculatorPage() {
  const [devices, setDevices] = useState({
    smartphones: 0,
    laptops: 0,
    batteries: 0,
    monitors: 0
  });

  const handleChange = (e) => {
    setDevices({ ...devices, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  // Mock calculation logic
  const calculateImpact = () => {
    const totalDevices = Object.values(devices).reduce((a, b) => a + b, 0);
    const co2Saved = (devices.smartphones * 15) + (devices.laptops * 45) + (devices.monitors * 30) + (devices.batteries * 5); // in kg
    const energySaved = (devices.smartphones * 50) + (devices.laptops * 150) + (devices.monitors * 100) + (devices.batteries * 10); // in kWh
    const toxicPrevented = (devices.smartphones * 0.1) + (devices.laptops * 0.5) + (devices.monitors * 1.5) + (devices.batteries * 0.2); // in kg
    return { totalDevices, co2Saved, energySaved, toxicPrevented };
  };

  const impact = calculateImpact();

  const chartData = [
    { name: 'Smartphones', value: devices.smartphones },
    { name: 'Laptops', value: devices.laptops },
    { name: 'Monitors', value: devices.monitors },
    { name: 'Batteries', value: devices.batteries },
  ].filter(d => d.value > 0);

  const COLORS = ['#1D9E75', '#2ecc8a', '#1a2d4a', '#fbbf24'];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator size={32} />
        </div>
        <h1 className="text-4xl font-black dark:text-white mb-4">Environmental Impact Calculator</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Calculate the positive environmental impact of recycling your electronic devices. See how much CO2, energy, and toxic waste you can save.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-secondary/80 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold dark:text-white mb-6">Your Devices</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-white/10 rounded-xl text-primary"><Smartphone size={24}/></div>
                <div>
                  <h3 className="font-bold dark:text-white">Smartphones</h3>
                  <p className="text-xs text-gray-500">Phones, Tablets</p>
                </div>
              </div>
              <input type="number" min="0" name="smartphones" value={devices.smartphones} onChange={handleChange} className="w-24 text-center bg-gray-50 dark:bg-black/20 border-none rounded-xl py-2 focus:ring-2 focus:ring-primary dark:text-white outline-none"/>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-white/10 rounded-xl text-primary"><Monitor size={24}/></div>
                <div>
                  <h3 className="font-bold dark:text-white">Laptops & PCs</h3>
                  <p className="text-xs text-gray-500">Computers, Servers</p>
                </div>
              </div>
              <input type="number" min="0" name="laptops" value={devices.laptops} onChange={handleChange} className="w-24 text-center bg-gray-50 dark:bg-black/20 border-none rounded-xl py-2 focus:ring-2 focus:ring-primary dark:text-white outline-none"/>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-white/10 rounded-xl text-primary"><Monitor size={24}/></div>
                <div>
                  <h3 className="font-bold dark:text-white">Monitors & TVs</h3>
                  <p className="text-xs text-gray-500">Screens, Displays</p>
                </div>
              </div>
              <input type="number" min="0" name="monitors" value={devices.monitors} onChange={handleChange} className="w-24 text-center bg-gray-50 dark:bg-black/20 border-none rounded-xl py-2 focus:ring-2 focus:ring-primary dark:text-white outline-none"/>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-white/10 rounded-xl text-primary"><Battery size={24}/></div>
                <div>
                  <h3 className="font-bold dark:text-white">Batteries</h3>
                  <p className="text-xs text-gray-500">Lithium-ion, Lead-acid</p>
                </div>
              </div>
              <input type="number" min="0" name="batteries" value={devices.batteries} onChange={handleChange} className="w-24 text-center bg-gray-50 dark:bg-black/20 border-none rounded-xl py-2 focus:ring-2 focus:ring-primary dark:text-white outline-none"/>
            </div>
          </div>
          
          <button className="w-full mt-8 bg-primary/10 text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-all">
            <Download size={20} />
            Download Detailed Report
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 opacity-10 group-hover:scale-150 transition-transform duration-500 -mr-6 -mt-6">
                <TreePine size={120} />
              </div>
              <TreePine size={28} className="mb-4" />
              <p className="text-4xl font-black mb-1">{impact.co2Saved}<span className="text-lg font-medium">kg</span></p>
              <p className="text-white/80 font-medium">CO₂ Emissions Saved</p>
            </div>
            
            <div className="bg-[#1a2d4a] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 opacity-10 group-hover:scale-150 transition-transform duration-500 -mr-6 -mt-6">
                <Zap size={120} />
              </div>
              <Zap size={28} className="mb-4 text-yellow-400" />
              <p className="text-4xl font-black mb-1">{impact.energySaved}<span className="text-lg font-medium">kWh</span></p>
              <p className="text-white/80 font-medium">Energy Conserved</p>
            </div>
            
            <div className="bg-white dark:bg-secondary/80 border border-gray-100 dark:border-white/10 p-6 rounded-3xl shadow-lg col-span-2 flex items-center justify-between">
              <div>
                <ShieldAlert size={28} className="mb-4 text-red-500" />
                <p className="text-3xl font-black dark:text-white mb-1">{impact.toxicPrevented.toFixed(2)}<span className="text-lg font-medium text-gray-500">kg</span></p>
                <p className="text-gray-500 font-medium">Toxic Materials Prevented from Landfill</p>
              </div>
              {chartData.length > 0 && (
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={30} outerRadius={60} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
