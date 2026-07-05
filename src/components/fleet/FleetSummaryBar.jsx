import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Car } from 'lucide-react';

export default function FleetSummaryBar({ vehicles }) {
  const safe = vehicles.filter(v => v.status === 'safe').length;
  const warning = vehicles.filter(v => v.status === 'warning').length;
  const critical = vehicles.filter(v => v.status === 'critical').length;
  const avgHealth = Math.round(vehicles.reduce((sum, v) => sum + v.health_score, 0) / vehicles.length);
  const avgCharge = Math.round(vehicles.reduce((sum, v) => sum + v.percentage, 0) / vehicles.length);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700/50 p-4 space-y-3">
      <h2 className="text-white font-semibold text-sm">Fleet Overview</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-3">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          <div>
            <p className="text-green-400 font-bold text-lg leading-none">{safe}</p>
            <p className="text-gray-400 text-xs">Safe</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <div>
            <p className="text-yellow-400 font-bold text-lg leading-none">{warning}</p>
            <p className="text-gray-400 text-xs">Warning</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-red-400 font-bold text-lg leading-none">{critical}</p>
            <p className="text-gray-400 text-xs">Critical</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-3">
          <Car className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-white font-bold text-lg leading-none">{avgHealth}%</p>
            <p className="text-gray-400 text-xs">Avg Health · {avgCharge}% chg</p>
          </div>
        </div>
      </div>
    </div>
  );
}