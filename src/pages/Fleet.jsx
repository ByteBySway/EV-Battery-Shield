import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronLeft, Car, AlertTriangle, CheckCircle, XCircle, Zap, Thermometer, Activity } from 'lucide-react';
import FleetVehicleCard from '@/components/fleet/FleetVehicleCard';
import FleetSummaryBar from '@/components/fleet/FleetSummaryBar';

const FLEET_VEHICLES = [
  { id: 'EV-001', name: 'Tesla Model 3', percentage: 82, temperature: 22.4, voltage: 385, health_score: 92, cell_balance: 95, status: 'safe', last_updated: '2 min ago' },
  { id: 'EV-002', name: 'Nissan Leaf', percentage: 47, temperature: 38.1, voltage: 367, health_score: 71, cell_balance: 78, status: 'warning', last_updated: '5 min ago' },
  { id: 'EV-003', name: 'Chevy Bolt', percentage: 95, temperature: 24.0, voltage: 398, health_score: 88, cell_balance: 91, status: 'safe', last_updated: '1 min ago' },
  { id: 'EV-004', name: 'BMW iX', percentage: 31, temperature: 46.3, voltage: 342, health_score: 54, cell_balance: 62, status: 'critical', last_updated: '8 min ago' },
  { id: 'EV-005', name: 'Hyundai Ioniq 5', percentage: 68, temperature: 27.5, voltage: 374, health_score: 85, cell_balance: 88, status: 'safe', last_updated: '3 min ago' },
  { id: 'EV-006', name: 'Ford Mustang Mach-E', percentage: 55, temperature: 33.2, voltage: 371, health_score: 77, cell_balance: 80, status: 'warning', last_updated: '6 min ago' },
];

export default function Fleet() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? FLEET_VEHICLES : FLEET_VEHICLES.filter(v => v.status === filter);

  const counts = {
    safe: FLEET_VEHICLES.filter(v => v.status === 'safe').length,
    warning: FLEET_VEHICLES.filter(v => v.status === 'warning').length,
    critical: FLEET_VEHICLES.filter(v => v.status === 'critical').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link to={createPageUrl('Dashboard')}>
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Fleet Management</h1>
            <p className="text-xs text-emerald-400">{FLEET_VEHICLES.length} vehicles monitored</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Summary Bar */}
        <FleetSummaryBar vehicles={FLEET_VEHICLES} />

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['all', 'safe', 'warning', 'critical'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f
                  ? f === 'all' ? 'bg-emerald-500 text-white'
                    : f === 'safe' ? 'bg-green-500 text-white'
                    : f === 'warning' ? 'bg-yellow-500 text-black'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {f === 'all' ? `All (${FLEET_VEHICLES.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`}
            </button>
          ))}
        </div>

        {/* Vehicle Cards */}
        <div className="space-y-3">
          {filtered.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <FleetVehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}