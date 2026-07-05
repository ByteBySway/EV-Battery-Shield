import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toFixed(1)} {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function BatteryChart({ data, dataKey, color, title, unit, gradient = true }) {
  const gradientId = `gradient-${dataKey}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700/50"
    >
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          {gradient ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                name={title}
                unit={unit}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 0, r: 3 }}
                name={title}
                unit={unit}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}