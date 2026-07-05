import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function StatusIndicator({ status }) {
  const config = {
    safe: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      label: 'All Systems Safe',
      pulse: 'bg-emerald-400'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20',
      label: 'Warning Detected',
      pulse: 'bg-amber-400'
    },
    critical: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/20',
      label: 'Critical Alert',
      pulse: 'bg-red-400'
    }
  };

  const { icon: Icon, color, bg, border, glow, label, pulse } = config[status] || config.safe;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bg} ${border} border shadow-lg ${glow}`}
    >
      <div className="relative">
        <Icon className={`w-5 h-5 ${color}`} />
        {status !== 'safe' && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`absolute inset-0 rounded-full ${pulse} opacity-30`}
          />
        )}
      </div>
      <span className={`text-sm font-medium ${color}`}>{label}</span>
    </motion.div>
  );
}