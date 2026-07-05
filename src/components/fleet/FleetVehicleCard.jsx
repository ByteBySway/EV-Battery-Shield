import React from 'react';
import { Thermometer, Zap, Activity, Clock } from 'lucide-react';

const statusConfig = {
  safe: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', label: '✓ Safe', dot: 'bg-green-400' },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: '⚠ Warning', dot: 'bg-yellow-400' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: '🚨 Critical', dot: 'bg-red-400' },
};

export default function FleetVehicleCard({ vehicle }) {
  const cfg = statusConfig[vehicle.status];

  return (
    <div className={`rounded-xl p-4 border ${cfg.bg} bg-gray-900/80`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
          <div>
            <p className="text-white font-semibold text-sm">{vehicle.name}</p>
            <p className="text-gray-500 text-xs">{vehicle.id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</p>
          <p className="text-gray-500 text-xs flex items-center gap-1 justify-end mt-0.5">
            <Clock className="w-3 h-3" />{vehicle.last_updated}
          </p>
        </div>
      </div>

      {/* Battery bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Charge</span>
          <span className="text-white font-medium">{vehicle.percentage}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              vehicle.percentage > 60 ? 'bg-emerald-500' :
              vehicle.percentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${vehicle.percentage}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-800/60 rounded-lg p-2 text-center">
          <Thermometer className="w-3.5 h-3.5 text-orange-400 mx-auto mb-0.5" />
          <p className="text-white text-xs font-semibold">{vehicle.temperature}°C</p>
          <p className="text-gray-500 text-xs">Temp</p>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-2 text-center">
          <Zap className="w-3.5 h-3.5 text-blue-400 mx-auto mb-0.5" />
          <p className="text-white text-xs font-semibold">{vehicle.voltage}V</p>
          <p className="text-gray-500 text-xs">Voltage</p>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-2 text-center">
          <Activity className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-0.5" />
          <p className="text-white text-xs font-semibold">{vehicle.health_score}</p>
          <p className="text-gray-500 text-xs">Health</p>
        </div>
      </div>
    </div>
  );
}