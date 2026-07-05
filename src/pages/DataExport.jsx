import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, Shield, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export default function DataExport() {
  const [startDate, setStartDate] = useState(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isExporting, setIsExporting] = useState(false);

  // Fetch data based on date range
  const { data: readings = [], refetch } = useQuery({
    queryKey: ['exportReadings', startDate, endDate],
    queryFn: async () => {
      const allReadings = await base44.entities.BatteryReading.list('-timestamp', 1000);
      return allReadings.filter(r => {
        const readingDate = new Date(r.timestamp);
        return readingDate >= new Date(startDate) && readingDate <= new Date(endDate + 'T23:59:59');
      });
    }
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['exportAlerts', startDate, endDate],
    queryFn: async () => {
      const allAlerts = await base44.entities.Alert.list('-created_date', 1000);
      return allAlerts.filter(a => {
        const alertDate = new Date(a.created_date);
        return alertDate >= new Date(startDate) && alertDate <= new Date(endDate + 'T23:59:59');
      });
    }
  });

  const { data: greenData = [] } = useQuery({
    queryKey: ['exportGreen', startDate, endDate],
    queryFn: async () => {
      const allGreen = await base44.entities.GreenEnergy.list('-date', 1000);
      return allGreen.filter(g => {
        const greenDate = new Date(g.date);
        return greenDate >= new Date(startDate) && greenDate <= new Date(endDate + 'T23:59:59');
      });
    }
  });

  // Generate CSV from readings
  const exportToCSV = () => {
    if (readings.length === 0) {
      toast.error('No data available for selected date range');
      return;
    }

    setIsExporting(true);

    const headers = ['Timestamp', 'Battery ID', 'Charge %', 'Temperature (°C)', 'Voltage (V)', 'Current (A)', 'Health Score', 'Cell Balance', 'Efficiency', 'Status'];
    const rows = readings.map(r => [
      format(new Date(r.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      r.battery_id,
      r.percentage,
      r.temperature?.toFixed(1) || 'N/A',
      r.voltage?.toFixed(1) || 'N/A',
      r.current?.toFixed(1) || 'N/A',
      r.health_score || 'N/A',
      r.cell_balance || 'N/A',
      r.efficiency || 'N/A',
      r.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `battery-data-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setIsExporting(false);
    toast.success('Data exported successfully');
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (readings.length === 0) {
      return {
        avgTemp: 0,
        maxTemp: 0,
        avgVoltage: 0,
        avgHealthScore: 0,
        totalChargeCycles: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        totalEnergySaved: 0,
        totalCO2Reduced: 0
      };
    }

    const temps = readings.map(r => r.temperature).filter(Boolean);
    const voltages = readings.map(r => r.voltage).filter(Boolean);
    const healthScores = readings.map(r => r.health_score).filter(Boolean);

    // Count charge cycles (when battery goes from <20% to >80%)
    let chargeCycles = 0;
    for (let i = 1; i < readings.length; i++) {
      if (readings[i-1].percentage < 20 && readings[i].percentage > 80) {
        chargeCycles++;
      }
    }

    return {
      avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1),
      avgVoltage: (voltages.reduce((a, b) => a + b, 0) / voltages.length).toFixed(1),
      avgHealthScore: Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length),
      totalChargeCycles: chargeCycles,
      criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
      warningAlerts: alerts.filter(a => a.severity === 'warning').length,
      totalEnergySaved: greenData.reduce((sum, g) => sum + (g.energy_saved_kwh || 0), 0).toFixed(1),
      totalCO2Reduced: greenData.reduce((sum, g) => sum + (g.co2_reduced_kg || 0), 0).toFixed(1)
    };
  };

  const summary = calculateSummary();

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
            <h1 className="text-xl font-bold text-white">Data Export & Reports</h1>
            <p className="text-xs text-gray-500">Export battery data and generate reports</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Date Range Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-white font-semibold">Select Date Range</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  setStartDate(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
                  setEndDate(format(new Date(), 'yyyy-MM-dd'));
                }}
                variant="outline"
                className="flex-1"
              >
                Last 7 Days
              </Button>
              <Button
                onClick={() => {
                  setStartDate(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
                  setEndDate(format(new Date(), 'yyyy-MM-dd'));
                }}
                variant="outline"
                className="flex-1"
              >
                Last 30 Days
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Found <span className="text-emerald-400 font-semibold">{readings.length}</span> readings in selected range
            </p>
          </div>
        </motion.div>

        {/* Summary Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-900/20 to-gray-900 rounded-xl p-4 border border-blue-700/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-semibold">Summary Report</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Battery Health Metrics */}
            <div className="col-span-2 bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-medium text-sm">Battery Health</h3>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Avg Health Score</span>
                  <span className="text-white font-medium">{summary.avgHealthScore}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Charge Cycles</span>
                  <span className="text-white font-medium">{summary.totalChargeCycles}</span>
                </div>
              </div>
            </div>

            {/* Temperature Metrics */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <h3 className="text-white font-medium text-sm">Temperature</h3>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Average</span>
                  <span className="text-white font-medium">{summary.avgTemp}°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Peak</span>
                  <span className="text-white font-medium">{summary.maxTemp}°C</span>
                </div>
              </div>
            </div>

            {/* Voltage Metrics */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-medium text-sm">Voltage</h3>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Average</span>
                  <span className="text-white font-medium">{summary.avgVoltage}V</span>
                </div>
              </div>
            </div>

            {/* Safety Alerts */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-400" />
                <h3 className="text-white font-medium text-sm">Alerts</h3>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Critical</span>
                  <span className="text-red-400 font-medium">{summary.criticalAlerts}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Warning</span>
                  <span className="text-yellow-400 font-medium">{summary.warningAlerts}</span>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-green-400" />
                <h3 className="text-white font-medium text-sm">Eco Impact</h3>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Energy Saved</span>
                  <span className="text-white font-medium">{summary.totalEnergySaved} kWh</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">CO₂ Reduced</span>
                  <span className="text-white font-medium">{summary.totalCO2Reduced} kg</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Button
            onClick={exportToCSV}
            disabled={readings.length === 0 || isExporting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export Data to CSV'}
          </Button>

          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <p className="text-gray-400 text-xs leading-relaxed">
              <span className="text-white font-medium">CSV Export includes:</span> Timestamp, Battery ID, Charge %, Temperature, Voltage, Current, Health Score, Cell Balance, Efficiency, and Status for all readings in the selected date range.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}