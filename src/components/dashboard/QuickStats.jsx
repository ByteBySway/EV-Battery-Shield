import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Thermometer, Zap, Activity } from 'lucide-react';

export default function QuickStats({ data }) {
  const stats = [
    { 
      label: 'Charge', 
      value: `${data?.percentage || 0}%`, 
      icon: Battery, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    { 
      label: 'Temp', 
      value: `${data?.temperature || 0}°C`, 
      icon: Thermometer, 
      color: data?.temperature > 45 ? 'text-amber-400' : 'text-blue-400',
      bg: data?.temperature > 45 ? 'bg-amber-500/10' : 'bg-blue-500/10'
    },
    { 
      label: 'Voltage', 
      value: `${data?.voltage || 0}V`, 
      icon: Zap, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Current', 
      value: `${data?.current || 0}A`, 
      icon: Activity, 
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`${stat.bg} rounded-xl p-4 border border-gray-700/50`}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
          </div>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}