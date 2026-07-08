import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import moment from 'moment';

import BatteryChart from '@/components/charts/BatteryChart';

export default function Graphs() {
  const [timeRange, setTimeRange] = useState('day');
  const [chartData, setChartData] = useState([]);

  const { data: readings = [] } = useQuery({
    queryKey: ['batteryReadings'],
    queryFn: () => base44.entities.BatteryReading.list('-timestamp', 100)
  });

  // Generate sample data for demonstration or pull from database
  useEffect(() => {
    const generateData = () => {
      const data = [];
      const baseTime = moment();

      // If we have actual database readings, use them to build consistent trend graphs!
      if (readings && readings.length >= 10) {
        // Sort readings from oldest to newest
        const sortedReadings = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const formatted = sortedReadings.map(r => ({
          time: moment(r.timestamp).format(
            timeRange === 'day' ? 'HH:mm' : timeRange === 'week' ? 'ddd DD' : 'MMM D'
          ),
          temperature: r.temperature,
          voltage: r.voltage,
          current: r.current,
          percentage: r.percentage
        }));
        setChartData(formatted);
        return;
      }

      // Fallback: Generate stable (non-random) mock data using deterministic waves
      if (timeRange === 'day') {
        for (let i = 23; i >= 0; i--) {
          data.push({
            time: baseTime.clone().subtract(i, 'hours').format('HH:mm'),
            temperature: 24 + Math.sin(i * 0.5) * 4 + (i % 3) * 0.5,
            voltage: 375 + Math.cos(i * 0.3) * 15 + (i % 4) * 1,
            current: 12 + Math.sin(i * 0.4) * 6 + (i % 2) * 2,
            percentage: 60 + (i * 1.5)
          });
        }
      } else if (timeRange === 'week') {
        for (let i = 6; i >= 0; i--) {
          data.push({
            time: baseTime.clone().subtract(i, 'days').format('ddd DD'),
            temperature: 25 + Math.sin(i * 0.6) * 3 + (i % 2) * 0.4,
            voltage: 372 + Math.cos(i * 0.4) * 10 + (i % 3) * 0.8,
            current: 14 + Math.sin(i * 0.3) * 5 + (i % 2) * 1,
            percentage: 65 + (i * 4)
          });
        }
      } else if (timeRange === 'month') {
        for (let i = 29; i >= 0; i--) {
          data.push({
            time: baseTime.clone().subtract(i, 'days').format('MMM D'),
            temperature: 23 + Math.sin(i * 0.25) * 5 + (i % 4) * 0.3,
            voltage: 365 + Math.cos(i * 0.15) * 25 + (i % 5) * 0.7,
            current: 15 + Math.sin(i * 0.2) * 7 + (i % 3) * 0.9,
            percentage: 45 + (i * 1.5)
          });
        }
      } else if (timeRange === '6months') {
        for (let i = 25; i >= 0; i--) {
          data.push({
            time: baseTime.clone().subtract(i, 'weeks').format('MMM D'),
            temperature: 25 + Math.sin(i * 0.15) * 6 + (i % 3) * 0.5,
            voltage: 370 + Math.cos(i * 0.08) * 20 + (i % 4) * 0.6,
            current: 13 + Math.sin(i * 0.12) * 6 + (i % 2) * 0.8,
            percentage: 50 + (i * 1.8)
          });
        }
      }

      setChartData(data);
    };

    generateData();
  }, [timeRange, readings]);

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
            <h1 className="text-xl font-bold text-white">Trends & History</h1>
            <p className="text-xs text-gray-500">Battery performance over time</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Time Range Selector */}
        <Tabs defaultValue="day" className="mb-6" onValueChange={setTimeRange}>
          <TabsList className="bg-gray-800/50 border border-gray-700/50 p-1 w-full">
            <TabsTrigger 
              value="day" 
              className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
            >
              <Calendar className="w-4 h-4 mr-1" />
              24 Hours
            </TabsTrigger>
            <TabsTrigger 
              value="week" 
              className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
            >
              Week
            </TabsTrigger>
            <TabsTrigger 
              value="month" 
              className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
            >
              Month
            </TabsTrigger>
            <TabsTrigger 
              value="6months" 
              className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
            >
              6 Months
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Statistics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-xl p-4 border border-blue-700/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Avg Temp</span>
            </div>
            <p className="text-xl font-bold text-blue-400">
              {(chartData.reduce((a, b) => a + b.temperature, 0) / (chartData.length || 1)).toFixed(1)}°C
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-xl p-4 border border-purple-700/30">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Avg Voltage</span>
            </div>
            <p className="text-xl font-bold text-purple-400">
              {(chartData.reduce((a, b) => a + b.voltage, 0) / (chartData.length || 1)).toFixed(1)}V
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/30 to-gray-900 rounded-xl p-4 border border-cyan-700/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Avg Current</span>
            </div>
            <p className="text-xl font-bold text-cyan-400">
              {(chartData.reduce((a, b) => a + b.current, 0) / (chartData.length || 1)).toFixed(1)}A
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/30 to-gray-900 rounded-xl p-4 border border-emerald-700/30">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-gray-400">Avg Charge</span>
            </div>
            <p className="text-xl font-bold text-emerald-400">
              {(chartData.reduce((a, b) => a + b.percentage, 0) / (chartData.length || 1)).toFixed(0)}%
            </p>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="space-y-4">
          <BatteryChart 
            data={chartData} 
            dataKey="temperature" 
            color="#3b82f6" 
            title="Temperature" 
            unit="°C"
          />
          
          <BatteryChart 
            data={chartData} 
            dataKey="voltage" 
            color="#a855f7" 
            title="Voltage" 
            unit="V"
          />
          
          <BatteryChart 
            data={chartData} 
            dataKey="current" 
            color="#06b6d4" 
            title="Current" 
            unit="A"
          />
          
          <BatteryChart 
            data={chartData} 
            dataKey="percentage" 
            color="#10b981" 
            title="Charge Level" 
            unit="%"
          />
        </div>
      </div>
    </div>
  );
}