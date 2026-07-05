import React from 'react';
import { motion } from 'framer-motion';

export default function BatteryVisual({ percentage, status }) {
  const getColor = () => {
    switch (status) {
      case 'critical': return { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' };
      case 'warning': return { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' };
      default: return { main: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' };
    }
  };

  const colors = getColor();

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      <svg width="160" height="280" viewBox="0 0 160 280" className="drop-shadow-2xl">
        {/* Battery terminal */}
        <rect x="55" y="0" width="50" height="16" rx="4" fill="#374151" />
        
        {/* Battery body outline */}
        <rect 
          x="20" y="16" 
          width="120" height="260" 
          rx="16" 
          fill="none" 
          stroke="#374151" 
          strokeWidth="4"
        />
        
        {/* Battery inner background */}
        <rect 
          x="28" y="24" 
          width="104" height="244" 
          rx="12" 
          fill="#1f2937"
        />
        
        {/* Battery fill level */}
        <motion.rect 
          x="32" y="28"
          width="96"
          rx="10"
          fill={colors.main}
          initial={{ height: 0, y: 264 }}
          animate={{ 
            height: (percentage / 100) * 236,
            y: 28 + (236 - (percentage / 100) * 236)
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 20px ${colors.glow})`
          }}
        />
        
        {/* Animated charging waves */}
        {percentage < 100 && (
          <motion.g
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <rect 
              x="32" 
              y={28 + (236 - (percentage / 100) * 236) - 4}
              width="96" 
              height="4" 
              fill="white"
              opacity="0.4"
              rx="2"
            />
          </motion.g>
        )}
        
        {/* Cell dividers */}
        {[1, 2, 3].map((i) => (
          <line
            key={i}
            x1="36"
            y1={28 + i * 59}
            x2="124"
            y2={28 + i * 59}
            stroke="#374151"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        ))}
      </svg>
      
      {/* Percentage display - positioned absolutely within battery bounds */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <span 
            className="text-5xl font-bold text-white leading-none"
            style={{ textShadow: `0 0 30px ${colors.glow}, 0 2px 10px rgba(0,0,0,0.5)` }}
          >
            {percentage}%
          </span>
          {percentage < 100 && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs font-medium text-white/70"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              Charging
            </motion.span>
          )}
        </div>
      </motion.div>
    </div>
  );
}