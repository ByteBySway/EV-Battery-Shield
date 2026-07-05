import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedGauge({ 
  value, 
  maxValue = 100, 
  size = 120, 
  strokeWidth = 10,
  label,
  unit,
  status = 'safe'
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusColor = () => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getGlowColor = () => {
    switch (status) {
      case 'critical': return 'rgba(239, 68, 68, 0.4)';
      case 'warning': return 'rgba(245, 158, 11, 0.4)';
      default: return 'rgba(16, 185, 129, 0.4)';
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStatusColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeDasharray={circumference}
          style={{
            filter: `drop-shadow(0 0 8px ${getGlowColor()})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value.toFixed(unit === '°C' || unit === 'V' ? 1 : 0)}
        </motion.span>
        <span className="text-xs text-gray-400">{unit}</span>
      </div>
      {label && (
        <span className="mt-2 text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      )}
    </div>
  );
}