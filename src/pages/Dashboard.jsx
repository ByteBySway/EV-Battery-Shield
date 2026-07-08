import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, ChevronRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

import AnimatedGauge from '@/components/dashboard/AnimatedGauge';
import BatteryVisual from '@/components/dashboard/BatteryVisual';
import HealthScoreCard from '@/components/dashboard/HealthScoreCard';
import StatusIndicator from '@/components/dashboard/StatusIndicator';
import QuickStats from '@/components/dashboard/QuickStats';
import AlertPopup from '@/components/common/AlertPopup';
import PredictionCard from '@/components/prediction/PredictionCard';
import EcoScoreCard from '@/components/green/EcoScoreCard';

export default function Dashboard() {
  const [activeAlert, setActiveAlert] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const queryClient = useQueryClient();

  // Base values for gradual simulation
  const initialReading = () => ({
    battery_id: 'EV-001',
    percentage: 95,
    temperature: 24.5,
    voltage: 380,
    current: 18.2,
    health_score: 92,
    cell_balance: 94,
    efficiency: 91,
    status: 'safe',
    timestamp: new Date().toISOString()
  });

  const [liveData, setLiveData] = useState(initialReading());

  // Fetch stored readings
  const { data: readings = [] } = useQuery({
    queryKey: ['batteryReadings'],
    queryFn: () => base44.entities.BatteryReading.list('-timestamp', 50)
  });

  // Fetch alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.filter({ is_resolved: false }, '-created_date', 10)
  });

  // Fetch green energy data
  const { data: greenData = [] } = useQuery({
    queryKey: ['greenEnergy'],
    queryFn: () => base44.entities.GreenEnergy.list('-date', 1)
  });

  // Simulate real-time updates smoothly
  useEffect(() => {
    let tickCount = 0;

    const interval = setInterval(() => {
      setLiveData(prev => {
        tickCount++;

        // Only fluctuate 15% of the time, otherwise values remain completely constant
        const shouldFluctuate = Math.random() < 0.15;

        const tempChange = shouldFluctuate ? (Math.random() - 0.5) * 0.3 : 0;
        const voltChange = shouldFluctuate ? (Math.random() - 0.5) * 0.8 : 0;
        const currChange = shouldFluctuate ? (Math.random() - 0.5) * 0.6 : 0;
        
        const newTemp = Math.max(22, Math.min(38, prev.temperature + tempChange));
        const newVolt = Math.max(360, Math.min(395, prev.voltage + voltChange));
        const newCurr = Math.max(10, Math.min(30, prev.current + currChange));
        
        // Slowly drop charge level over time (e.g. 5% chance of dropping 1%)
        const newPerc = Math.max(10, prev.percentage - (Math.random() > 0.95 ? 1 : 0));

        const newReading = {
          ...prev,
          temperature: newTemp,
          voltage: newVolt,
          current: newCurr,
          percentage: newPerc,
          timestamp: new Date().toISOString()
        };

        // Determine safety status based on temperature
        if (newReading.temperature > 35) {
          newReading.status = 'warning';
          if (newReading.temperature > 40) {
            newReading.status = 'critical';
            setActiveAlert({
              type: 'overheating',
              severity: 'critical',
              message: `Battery temperature is critically high at ${newReading.temperature.toFixed(1)}°C`,
              value: newReading.temperature.toFixed(1),
              threshold: 40
            });
          }
        } else {
          newReading.status = 'safe';
        }

        // Only save to DB when values fluctuate, or every 60 seconds (12 ticks) to avoid spamming the backend
        if (shouldFluctuate || tickCount % 12 === 0) {
          base44.entities.BatteryReading.create({
            battery_id: newReading.battery_id,
            percentage: Math.round(newReading.percentage),
            temperature: parseFloat(newReading.temperature.toFixed(2)),
            voltage: parseFloat(newReading.voltage.toFixed(2)),
            current: parseFloat(newReading.current.toFixed(2)),
            health_score: newReading.health_score,
            cell_balance: newReading.cell_balance,
            efficiency: newReading.efficiency,
            status: newReading.status,
            timestamp: newReading.timestamp
          }).then(() => {
            queryClient.invalidateQueries({ queryKey: ['batteryReadings'] });
          }).catch(err => console.error("Error creating reading:", err));
        }

        return newReading;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [queryClient]);

  // Generate predictions based on current data
  const predictions = [
    {
      metric: 'Temperature',
      trend: liveData.temperature > 40 ? 'up' : 'stable',
      risk: liveData.temperature > 45 ? 'high' : liveData.temperature > 40 ? 'medium' : 'low',
      message: liveData.temperature > 40 
        ? 'Temperature trending upward. Consider reducing charge rate.' 
        : 'Temperature within optimal range.',
      timeframe: liveData.temperature > 40 ? 'Next 30 minutes' : null
    },
    {
      metric: 'Cell Balance',
      trend: liveData.cell_balance < 85 ? 'down' : 'stable',
      risk: liveData.cell_balance < 75 ? 'high' : liveData.cell_balance < 85 ? 'medium' : 'low',
      message: liveData.cell_balance < 85 
        ? 'Cell imbalance detected. Balancing recommended.' 
        : 'Cells are well balanced.',
      timeframe: liveData.cell_balance < 85 ? 'Within 2 hours' : null
    },
    {
      metric: 'Battery Life',
      trend: 'stable',
      risk: 'low',
      message: 'Based on current usage patterns, battery health is maintained.',
      timeframe: 'Est. 8+ years lifespan'
    }
  ];

  const unreadAlerts = alerts.filter(a => !a.is_read).length;

  const getStatus = () => {
        if (liveData.temperature > 40 || liveData.voltage < 320 || liveData.voltage > 400) return 'critical';
              if (liveData.temperature > 25 || liveData.voltage < 340 || liveData.voltage > 390 || liveData.cell_balance < 75) return 'warning';
        return 'safe';
      };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pb-24">
      <AlertPopup 
        alert={activeAlert} 
        onDismiss={() => setActiveAlert(null)}
        soundEnabled={soundEnabled}
      />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">EV Battery Shield</h1>
            <p className="text-xs text-emerald-400">Early-warning & fire prevention system</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to={createPageUrl('Alerts')}>
              <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
                {unreadAlerts > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                  >
                    {unreadAlerts}
                  </motion.span>
                )}
              </Button>
            </Link>
            <Link to={createPageUrl('Settings')}>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Purpose Statement */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-emerald-900/30 to-gray-900/30 rounded-lg p-3 border border-emerald-700/30">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-emerald-400">Mission:</span> Early-warning and protection system to prevent EV battery overheating and fire.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Safety Status Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700/50 space-y-3"
        >
          <h2 className="text-white font-semibold text-sm mb-3">Safety Status Dashboard</h2>

          <div className="grid grid-cols-1 gap-2">
            {/* Battery Safety Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-400 text-sm">Battery Safety Status</span>
              <span className={`font-semibold text-sm ${
                getStatus() === 'safe' ? 'text-green-400' : 
                getStatus() === 'warning' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {getStatus() === 'safe' ? '✓ Safe' : 
                 getStatus() === 'warning' ? '⚠ Warning' : '🚨 Critical'}
              </span>
            </div>

            {/* Thermal Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-400 text-sm">Thermal Status</span>
              <span className={`font-semibold text-sm ${
                liveData.temperature <= 25 ? 'text-green-400' : 
                liveData.temperature <= 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {liveData.temperature <= 25 ? '✓ Normal' : 
                 liveData.temperature <= 40 ? '⚠ Elevated' : '🚨 Overheating'}
              </span>
            </div>

            {/* Charging Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-400 text-sm">Charging Status</span>
              <span className={`font-semibold text-sm ${
                liveData.voltage <= 390 ? 'text-green-400' : 
                liveData.voltage <= 400 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {liveData.voltage <= 390 ? '✓ Normal' : 
                 liveData.voltage <= 400 ? '⚠ High Voltage' : '🚨 Overcharge Risk'}
              </span>
            </div>
          </div>

          {/* Critical Warning Message */}
          {(liveData.temperature > 40 || liveData.voltage > 400) && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mt-3 p-3 rounded-lg bg-red-900/30 border border-red-500/50"
            >
              <p className="text-red-400 text-sm font-medium mb-1">⚠️ SAFETY WARNING</p>
              <p className="text-red-300 text-xs">
                {liveData.temperature > 40 && liveData.voltage > 400 
                  ? "Critical conditions detected! Stop charging immediately to prevent thermal runaway."
                  : liveData.temperature > 40 
                  ? "High temperature detected. Reduce charge rate and ensure proper cooling."
                  : "Overcharge risk detected. Disconnect charger immediately to prevent battery damage."}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Main Battery Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-center">
            <BatteryVisual percentage={liveData.percentage} status={getStatus()} />
          </div>
          
          {/* Gauges Row */}
          <div className="flex justify-around mt-4">
            <AnimatedGauge 
              value={liveData.temperature} 
              maxValue={80} 
              size={80}
              label="Temp"
              unit="°C"
              status={liveData.temperature > 40 ? 'critical' : liveData.temperature > 25 ? 'warning' : 'safe'}
            />
            <AnimatedGauge 
              value={liveData.voltage} 
              maxValue={450} 
              size={80}
              label="Voltage"
              unit="V"
              status={liveData.voltage < 320 || liveData.voltage > 400 ? 'critical' : liveData.voltage < 340 || liveData.voltage > 390 ? 'warning' : 'safe'}
            />
            <AnimatedGauge 
              value={liveData.current} 
              maxValue={50} 
              size={80}
              label="Current"
              unit="A"
              status={liveData.current > 40 ? 'warning' : 'safe'}
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <QuickStats data={liveData} />

        {/* Health Score */}
        <HealthScoreCard 
          score={liveData.health_score}
          cellBalance={liveData.cell_balance}
          efficiency={liveData.efficiency}
          safety={getStatus() === 'safe' ? 95 : getStatus() === 'warning' ? 70 : 40}
        />

        {/* Predictive Analytics */}
        <PredictionCard predictions={predictions} />

        {/* Green Energy */}
        <EcoScoreCard data={greenData[0] || {
          energy_saved_kwh: 234.5,
          co2_reduced_kg: 89.2,
          eco_score: 87,
          trees_equivalent: 4,
          optimal_charge_start: '11:00 PM',
          optimal_charge_end: '6:00 AM'
        }} />

        {/* Quick Links */}
        <div className="space-y-3">
          <Link to={createPageUrl('Fleet')}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-teal-900/30 to-gray-900 rounded-xl p-4 border border-teal-700/30 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-medium">Fleet Management</h3>
                <p className="text-xs text-gray-400">Monitor all EVs in your fleet</p>
              </div>
              <ChevronRight className="w-5 h-5 text-teal-400" />
            </motion.div>
          </Link>

          <Link to={createPageUrl('Export')}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-indigo-900/30 to-gray-900 rounded-xl p-4 border border-indigo-700/30 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-medium">Export Battery Data</h3>
                <p className="text-xs text-gray-400">Download CSV & generate reports</p>
              </div>
              <ChevronRight className="w-5 h-5 text-indigo-400" />
            </motion.div>
          </Link>

          <Link to={createPageUrl('SafetyInfo')}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-900/30 to-gray-900 rounded-xl p-4 border border-blue-700/30 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-medium">Why EV Battery Fires Occur</h3>
                <p className="text-xs text-gray-400">Scientific explanation & prevention</p>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-400" />
            </motion.div>
          </Link>

          <Link to={createPageUrl('CaseStudies')}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-orange-900/30 to-gray-900 rounded-xl p-4 border border-orange-700/30 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-medium">Real-World Case Studies</h3>
                <p className="text-xs text-gray-400">Evidence from reported fire incidents</p>
              </div>
              <ChevronRight className="w-5 h-5 text-orange-400" />
            </motion.div>
          </Link>

          <Link to={createPageUrl('BeforeAfter')}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-900/30 via-gray-900 to-emerald-900/30 rounded-xl p-4 border border-purple-700/30 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-medium">Before vs After Comparison</h3>
                <p className="text-xs text-gray-400">🔥 vs 🛡️ • The power of awareness</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </motion.div>
          </Link>

          <Link to={createPageUrl('Graphs')}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-900/30 to-gray-900 rounded-xl p-4 border border-purple-700/30 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-medium">View Trends & History</h3>
                <p className="text-xs text-gray-400">Analyze battery performance over time</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </motion.div>
          </Link>

          <Link to={createPageUrl('Chat')}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-cyan-900/30 to-gray-900 rounded-xl p-4 border border-cyan-700/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">AI Battery Assistant</h3>
                  <p className="text-xs text-gray-400">Ask questions about your battery health</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}