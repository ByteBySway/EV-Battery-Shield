import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, TreeDeciduous, CloudOff, Zap, Clock } from 'lucide-react';

export default function EcoScoreCard({ data }) {
  const metrics = [
    { 
      icon: Zap, 
      label: 'Energy Saved', 
      value: `${data?.energy_saved_kwh?.toFixed(1) || 0} kWh`,
      color: 'text-emerald-400' 
    },
    { 
      icon: CloudOff, 
      label: 'CO₂ Reduced', 
      value: `${data?.co2_reduced_kg?.toFixed(1) || 0} kg`,
      color: 'text-cyan-400' 
    },
    { 
      icon: TreeDeciduous, 
      label: 'Trees Equivalent', 
      value: `${data?.trees_equivalent || 0} trees`,
      color: 'text-green-400' 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-900/30 to-gray-900 rounded-2xl p-5 border border-emerald-700/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Eco Score</h3>
            <p className="text-xs text-gray-400">Your environmental impact</p>
          </div>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center"
          style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}
        >
          <span className="text-xl font-bold text-white">{data?.eco_score || 0}</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="text-center"
          >
            <metric.icon className={`w-5 h-5 ${metric.color} mx-auto mb-2`} />
            <p className={`text-sm font-semibold ${metric.color}`}>{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-gray-300">Optimal Charging Window</span>
        </div>
        <p className="text-lg font-semibold text-amber-400">
          {data?.optimal_charge_start || '11:00 PM'} - {data?.optimal_charge_end || '6:00 AM'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Lower grid demand = cleaner energy</p>
      </div>
    </motion.div>
  );
}