import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Activity } from 'lucide-react';

export default function HealthScoreCard({ score, cellBalance, efficiency, safety }) {
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400';
    if (val >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGradient = (val) => {
    if (val >= 80) return 'from-emerald-500 to-emerald-600';
    if (val >= 60) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const metrics = [
    { label: 'Cell Balance', value: cellBalance, icon: Activity },
    { label: 'Efficiency', value: efficiency, icon: Zap },
    { label: 'Safety', value: safety, icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Battery Health</h3>
        <Shield className="w-5 h-5 text-emerald-400" />
      </div>
      
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${getScoreGradient(score)} flex items-center justify-center`}
            style={{
              boxShadow: `0 0 30px ${score >= 80 ? 'rgba(16, 185, 129, 0.3)' : score >= 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}
          >
            <span className="text-2xl font-bold text-white">{score}</span>
          </motion.div>
        </div>
        <div>
          <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Attention'}
          </p>
          <p className="text-xs text-gray-500">Overall Health Score</p>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <metric.icon className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{metric.label}</span>
                <span className={getScoreColor(metric.value)}>{metric.value}%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(metric.value)}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}