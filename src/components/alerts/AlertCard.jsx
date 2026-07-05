import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Flame, Zap, Battery, CircleSlash, Activity, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';

const alertIcons = {
  overheating: Flame,
  overcharging: Battery,
  cell_imbalance: Activity,
  short_circuit: CircleSlash,
  low_voltage: Zap,
  high_current: AlertTriangle
};

const severityConfig = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    color: 'text-blue-400',
    iconBg: 'bg-blue-500/20'
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    color: 'text-amber-400',
    iconBg: 'bg-amber-500/20'
  },
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    color: 'text-red-400',
    iconBg: 'bg-red-500/20'
  }
};

export default function AlertCard({ alert, onMarkRead, onResolve }) {
  const Icon = alertIcons[alert.type] || AlertTriangle;
  const config = severityConfig[alert.severity] || severityConfig.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`${config.bg} ${config.border} border rounded-xl p-4 ${alert.is_read ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`${config.iconBg} p-2 rounded-lg`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-semibold ${config.color} capitalize`}>
              {alert.type.replace('_', ' ')}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} capitalize`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{moment(alert.created_date).fromNow()}</span>
            {alert.value && alert.threshold && (
              <span>• Value: {alert.value} / Threshold: {alert.threshold}</span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {!alert.is_read && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-white"
              onClick={() => onMarkRead(alert.id)}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          {!alert.is_resolved && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-emerald-400"
              onClick={() => onResolve(alert.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}