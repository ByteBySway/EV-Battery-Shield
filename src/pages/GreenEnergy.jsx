import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, TreeDeciduous, CloudOff, Zap, Clock, TrendingUp, Award, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GreenEnergy() {
  const { data: greenData = [] } = useQuery({
    queryKey: ['greenEnergy'],
    queryFn: () => base44.entities.GreenEnergy.list('-date', 30)
  });

  // Sample data for demonstration
  const energyData = greenData.length > 0 ? greenData[0] : {
    energy_saved_kwh: 234.5,
    co2_reduced_kg: 89.2,
    eco_score: 87,
    trees_equivalent: 4,
    optimal_charge_start: '11:00 PM',
    optimal_charge_end: '6:00 AM'
  };

  // Weekly energy savings chart data
  const weeklyData = [
    { day: 'Mon', saved: 32 },
    { day: 'Tue', saved: 28 },
    { day: 'Wed', saved: 45 },
    { day: 'Thu', saved: 38 },
    { day: 'Fri', saved: 42 },
    { day: 'Sat', saved: 25 },
    { day: 'Sun', saved: 24 }
  ];

  const tips = [
    { icon: Moon, title: 'Charge at Night', description: 'Off-peak hours (11 PM - 6 AM) use cleaner grid energy', color: 'text-indigo-400' },
    { icon: Sun, title: 'Avoid Peak Hours', description: 'Skip charging during 4 PM - 8 PM to reduce carbon footprint', color: 'text-amber-400' },
    { icon: Zap, title: 'Limit Fast Charging', description: 'Use Level 2 charging for better efficiency and battery health', color: 'text-cyan-400' },
    { icon: TrendingUp, title: 'Optimal Range', description: 'Keep battery between 20-80% for maximum lifespan', color: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Green Energy</h1>
            <p className="text-xs text-gray-500">Your environmental impact</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Eco Score Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-900/40 to-gray-900 rounded-3xl p-6 border border-emerald-700/30 text-center"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative"
            >
              <div 
                className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center"
                style={{ boxShadow: '0 0 60px rgba(16, 185, 129, 0.4)' }}
              >
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">{energyData.eco_score}</span>
                  <p className="text-xs text-emerald-100">ECO SCORE</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/30"
              />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Eco Champion! 🌱</h2>
          <p className="text-emerald-300 text-sm">You're in the top 15% of eco-friendly EV drivers</p>
        </motion.div>

        {/* Impact Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700/50 text-center"
          >
            <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{energyData.energy_saved_kwh}</p>
            <p className="text-xs text-gray-400">kWh Saved</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700/50 text-center"
          >
            <CloudOff className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{energyData.co2_reduced_kg}</p>
            <p className="text-xs text-gray-400">kg CO₂ Reduced</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700/50 text-center"
          >
            <TreeDeciduous className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{energyData.trees_equivalent}</p>
            <p className="text-xs text-gray-400">Trees Planted*</p>
          </motion.div>
        </div>

        {/* Weekly Savings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
        >
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Weekly Energy Savings</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 10 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="saved"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#greenGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Optimal Charging Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-900/30 to-gray-900 rounded-2xl p-5 border border-indigo-700/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Optimal Charging Schedule</h3>
              <p className="text-xs text-gray-400">For maximum eco-efficiency</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
            <div className="text-center">
              <Moon className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-indigo-400">{energyData.optimal_charge_start}</p>
              <p className="text-xs text-gray-500">Start</p>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
            </div>
            <div className="text-center">
              <Sun className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-400">{energyData.optimal_charge_end}</p>
              <p className="text-xs text-gray-500">End</p>
            </div>
          </div>
        </motion.div>

        {/* Eco Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Eco Tips</h3>
          </div>
          <div className="space-y-3">
            {tips.map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl"
              >
                <tip.icon className={`w-5 h-5 ${tip.color} mt-0.5`} />
                <div>
                  <p className="text-sm text-white font-medium">{tip.title}</p>
                  <p className="text-xs text-gray-400">{tip.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-900/20 to-gray-900 rounded-2xl p-5 border border-amber-700/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Achievements</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'First 100 kWh', unlocked: true },
              { name: 'Week Streak', unlocked: true },
              { name: 'Night Owl', unlocked: true },
              { name: '500 kWh Club', unlocked: false },
              { name: 'Carbon Hero', unlocked: false },
              { name: 'Eco Master', unlocked: false },
            ].map((achievement, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * idx }}
                className={`p-3 rounded-xl text-center ${
                  achievement.unlocked 
                    ? 'bg-amber-500/20 border border-amber-500/30' 
                    : 'bg-gray-800/50 border border-gray-700/30 opacity-50'
                }`}
              >
                <Award className={`w-6 h-6 mx-auto mb-1 ${achievement.unlocked ? 'text-amber-400' : 'text-gray-600'}`} />
                <p className={`text-xs ${achievement.unlocked ? 'text-amber-300' : 'text-gray-500'}`}>
                  {achievement.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}