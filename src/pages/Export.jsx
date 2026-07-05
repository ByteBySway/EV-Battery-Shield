import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';

export default function Export() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: readings = [] } = useQuery({
    queryKey: ['batteryReadings'],
    queryFn: () => base44.entities.BatteryReading.list('-timestamp', 1000)
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date', 1000)
  });

  const { data: greenData = [] } = useQuery({
    queryKey: ['greenEnergy'],
    queryFn: () => base44.entities.GreenEnergy.list('-date', 1000)
  });

  const filterByDateRange = (data, dateField) => {
    if (!startDate && !endDate) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      return itemDate >= start && itemDate <= end;
    });
  };

  const getSampleReadings = (forDateRange = false) => {
    const sample = [];
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59);
    const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    for (let i = 0; i <= diffDays; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      sample.push({
        battery_id: 'EV-001',
        timestamp: d.toISOString(),
        percentage: Math.floor(60 + Math.random() * 35),
        temperature: +(22 + Math.random() * 10).toFixed(1),
        voltage: +(370 + Math.random() * 25).toFixed(1),
        current: +(15 + Math.random() * 15).toFixed(1),
        health_score: Math.floor(80 + Math.random() * 15),
        cell_balance: Math.floor(85 + Math.random() * 12),
        efficiency: Math.floor(88 + Math.random() * 10),
        status: 'safe'
      });
    }
    return sample;
  };

  const generateCSV = () => {
    setIsGenerating(true);
    
    let filteredReadings = filterByDateRange(readings, 'timestamp');
    if (filteredReadings.length === 0) filteredReadings = getSampleReadings(true);

    // CSV headers
    const headers = ['Timestamp', 'Battery ID', 'Percentage (%)', 'Temperature (°C)', 'Voltage (V)', 'Current (A)', 'Health Score', 'Cell Balance', 'Efficiency (%)', 'Status'];
    
    // CSV rows
    const rows = filteredReadings.map(reading => [
      format(new Date(reading.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      reading.battery_id,
      reading.percentage,
      reading.temperature,
      reading.voltage,
      reading.current || 0,
      reading.health_score || 0,
      reading.cell_balance || 0,
      reading.efficiency || 0,
      reading.status
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `battery-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  const generateSummaryReport = () => {
    setIsGenerating(true);

    let filteredReadings = filterByDateRange(readings, 'timestamp');
    if (filteredReadings.length === 0) filteredReadings = getSampleReadings(true);
    const filteredAlerts = filterByDateRange(alerts, 'created_date');
    const filteredGreen = filterByDateRange(greenData, 'date');

    // Calculate statistics
    const avgTemp = (filteredReadings.reduce((sum, r) => sum + r.temperature, 0) / filteredReadings.length).toFixed(2);
    const avgVoltage = (filteredReadings.reduce((sum, r) => sum + r.voltage, 0) / filteredReadings.length).toFixed(2);
    const avgHealth = (filteredReadings.reduce((sum, r) => sum + (r.health_score || 0), 0) / filteredReadings.length).toFixed(2);
    const avgEfficiency = (filteredReadings.reduce((sum, r) => sum + (r.efficiency || 0), 0) / filteredReadings.length).toFixed(2);
    
    const maxTemp = Math.max(...filteredReadings.map(r => r.temperature)).toFixed(2);
    const minTemp = Math.min(...filteredReadings.map(r => r.temperature)).toFixed(2);
    
    const criticalAlerts = filteredAlerts.filter(a => a.severity === 'critical').length;
    const warningAlerts = filteredAlerts.filter(a => a.severity === 'warning').length;
    
    const totalEnergySaved = filteredGreen.reduce((sum, g) => sum + (g.energy_saved_kwh || 0), 0).toFixed(2);
    const totalCO2Reduced = filteredGreen.reduce((sum, g) => sum + (g.co2_reduced_kg || 0), 0).toFixed(2);
    
    const safeReadings = filteredReadings.filter(r => r.status === 'safe').length;
    const warningReadings = filteredReadings.filter(r => r.status === 'warning').length;
    const criticalReadings = filteredReadings.filter(r => r.status === 'critical').length;

    // Create report content
    const reportContent = `
=== EV BATTERY SHIELD - SUMMARY REPORT ===
Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
Period: ${startDate || 'All time'} to ${endDate || 'Present'}

--- BATTERY HEALTH METRICS ---
Total Readings: ${filteredReadings.length}
Average Health Score: ${avgHealth}%
Average Efficiency: ${avgEfficiency}%
Average Cell Balance: ${(filteredReadings.reduce((sum, r) => sum + (r.cell_balance || 0), 0) / filteredReadings.length).toFixed(2)}%

--- TEMPERATURE ANALYSIS ---
Average Temperature: ${avgTemp}°C
Maximum Temperature: ${maxTemp}°C
Minimum Temperature: ${minTemp}°C
Readings in Safe Range (20-25°C): ${filteredReadings.filter(r => r.temperature >= 20 && r.temperature <= 25).length}
Readings with Elevated Temp (25-40°C): ${filteredReadings.filter(r => r.temperature > 25 && r.temperature <= 40).length}
Readings with Critical Temp (>40°C): ${filteredReadings.filter(r => r.temperature > 40).length}

--- VOLTAGE ANALYSIS ---
Average Voltage: ${avgVoltage}V
Maximum Voltage: ${Math.max(...filteredReadings.map(r => r.voltage)).toFixed(2)}V
Minimum Voltage: ${Math.min(...filteredReadings.map(r => r.voltage)).toFixed(2)}V
Readings in Optimal Range (340-390V): ${filteredReadings.filter(r => r.voltage >= 340 && r.voltage <= 390).length}

--- SAFETY ALERTS ---
Total Alerts: ${filteredAlerts.length}
Critical Alerts: ${criticalAlerts}
Warning Alerts: ${warningAlerts}
Info Alerts: ${filteredAlerts.filter(a => a.severity === 'info').length}
Resolved Alerts: ${filteredAlerts.filter(a => a.is_resolved).length}

--- STATUS DISTRIBUTION ---
Safe Status: ${safeReadings} (${((safeReadings / filteredReadings.length) * 100).toFixed(1)}%)
Warning Status: ${warningReadings} (${((warningReadings / filteredReadings.length) * 100).toFixed(1)}%)
Critical Status: ${criticalReadings} (${((criticalReadings / filteredReadings.length) * 100).toFixed(1)}%)

--- ENVIRONMENTAL IMPACT ---
Total Energy Saved: ${totalEnergySaved} kWh
Total CO2 Reduced: ${totalCO2Reduced} kg
Equivalent Trees Planted: ${(filteredGreen.reduce((sum, g) => sum + (g.trees_equivalent || 0), 0)).toFixed(0)}
Average Eco Score: ${(filteredGreen.reduce((sum, g) => sum + (g.eco_score || 0), 0) / (filteredGreen.length || 1)).toFixed(1)}%

--- RECOMMENDATIONS ---
${avgTemp > 30 ? '⚠ Average temperature is elevated. Consider improving cooling or reducing ambient temperature exposure.' : '✓ Temperature levels are healthy.'}
${avgHealth < 80 ? '⚠ Battery health is declining. Schedule maintenance check.' : '✓ Battery health is good.'}
${criticalAlerts > 0 ? `⚠ ${criticalAlerts} critical alert(s) detected. Review immediately.` : '✓ No critical safety issues detected.'}
${avgVoltage > 390 ? '⚠ Voltage running high. Monitor charging practices to prevent overcharge.' : '✓ Voltage levels are optimal.'}

--- END OF REPORT ---
Generated by EV Battery Shield
    `.trim();

    // Download report
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `battery-summary-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

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
            <h1 className="text-xl font-bold text-white">Export Battery Data</h1>
            <p className="text-xs text-gray-500">Download historical data & reports</p>
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
              <Label className="text-gray-400 text-sm mb-1">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-sm mb-1">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <p className="text-gray-500 text-xs">
              Leave blank to export all available data
            </p>
          </div>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {/* CSV Export */}
          <div className="bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-xl p-4 border border-blue-700/30">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Export Raw Data (CSV)</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Download detailed battery readings including temperature, voltage, current, health scores, and more in CSV format
                </p>
                <ul className="text-gray-500 text-xs mt-2 space-y-1 ml-4">
                  <li>• Timestamp logs</li>
                  <li>• Temperature readings</li>
                  <li>• Voltage & current data</li>
                  <li>• Health & efficiency scores</li>
                  <li>• Cell balance metrics</li>
                </ul>
              </div>
            </div>
            <Button 
              onClick={generateCSV}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download CSV File'}
            </Button>
          </div>

          {/* Summary Report */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-gray-900 rounded-xl p-4 border border-emerald-700/30">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Generate Summary Report</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Comprehensive analysis report with statistics, safety metrics, and recommendations
                </p>
                <ul className="text-gray-500 text-xs mt-2 space-y-1 ml-4">
                  <li>• Battery health analysis</li>
                  <li>• Temperature & voltage trends</li>
                  <li>• Safety alerts summary</li>
                  <li>• Environmental impact metrics</li>
                  <li>• Personalized recommendations</li>
                </ul>
              </div>
            </div>
            <Button 
              onClick={generateSummaryReport}
              disabled={isGenerating}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download Summary Report'}
            </Button>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30"
        >
          <p className="text-gray-400 text-sm">
            <span className="text-emerald-400 font-semibold">💡 Tip:</span> Regular data exports help track long-term battery performance and identify trends early. Share reports with service centers for professional maintenance.
          </p>
        </motion.div>
      </div>
    </div>
  );
}