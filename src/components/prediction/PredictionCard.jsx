import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function PredictionCard({ predictions }) {
  if (!predictions || predictions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-400" />
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Predictive Analytics</h3>
        </div>
        <p className="text-gray-500 text-sm">Collecting data for predictions...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Predictive Analytics</h3>
      </div>
      
      <div className="space-y-3">
        {predictions.map((pred, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-3 rounded-xl ${
              pred.risk === 'high' ? 'bg-red-500/10 border border-red-500/30' :
              pred.risk === 'medium' ? 'bg-amber-500/10 border border-amber-500/30' :
              'bg-emerald-500/10 border border-emerald-500/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {pred.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                {pred.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-400" />}
                {pred.trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                <span className="text-sm text-gray-300 capitalize">{pred.metric}</span>
              </div>
              {pred.risk === 'high' ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : pred.risk === 'low' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">{pred.message}</p>
            {pred.timeframe && (
              <p className="text-xs text-gray-500 mt-1">Expected: {pred.timeframe}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}