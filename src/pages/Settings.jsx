import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Volume2, Thermometer, Zap, Battery, Save, Plus, Trash2, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Settings() {
  const queryClient = useQueryClient();
  
  const { data: settings = [] } = useQuery({
    queryKey: ['batterySettings'],
    queryFn: () => base44.entities.BatterySettings.list()
  });

  const [formData, setFormData] = useState({
    battery_id: 'EV-001',
    battery_name: 'My Tesla',
    temp_warning_threshold: 45,
    temp_critical_threshold: 55,
    voltage_min_threshold: 350,
    voltage_max_threshold: 420,
    notifications_enabled: true,
    sound_alerts_enabled: true,
    unit_temperature: 'celsius'
  });

  useEffect(() => {
    if (settings.length > 0) {
      setFormData({ ...formData, ...settings[0] });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings.length > 0) {
        return base44.entities.BatterySettings.update(settings[0].id, data);
      } else {
        return base44.entities.BatterySettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['batterySettings']);
      toast.success('Settings saved successfully');
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Settings</h1>
              <p className="text-xs text-gray-500">Configure your preferences</p>
            </div>
          </div>
          <Button 
            onClick={handleSave}
            disabled={saveMutation.isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Battery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Vehicle Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-400 text-sm">Battery ID</Label>
              <Input
                value={formData.battery_id}
                onChange={(e) => setFormData({ ...formData, battery_id: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="EV-001"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Vehicle Name</Label>
              <Input
                value={formData.battery_name}
                onChange={(e) => setFormData({ ...formData, battery_name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="My Tesla"
              />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive alerts on your device</p>
              </div>
              <Switch
                checked={formData.notifications_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, notifications_enabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Sound Alerts</p>
                <p className="text-xs text-gray-500">Play sound for critical alerts</p>
              </div>
              <Switch
                checked={formData.sound_alerts_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, sound_alerts_enabled: checked })}
              />
            </div>
          </div>
        </motion.div>

        {/* Temperature Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-red-400" />
            <h3 className="text-white font-semibold">Temperature Thresholds</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-gray-400 text-sm">Warning Threshold</Label>
                <span className="text-amber-400 font-medium">{formData.temp_warning_threshold}°C</span>
              </div>
              <Slider
                value={[formData.temp_warning_threshold]}
                onValueChange={(val) => setFormData({ ...formData, temp_warning_threshold: val[0] })}
                min={30}
                max={60}
                step={1}
                className="[&_[role=slider]]:bg-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-gray-400 text-sm">Critical Threshold</Label>
                <span className="text-red-400 font-medium">{formData.temp_critical_threshold}°C</span>
              </div>
              <Slider
                value={[formData.temp_critical_threshold]}
                onValueChange={(val) => setFormData({ ...formData, temp_critical_threshold: val[0] })}
                min={40}
                max={70}
                step={1}
                className="[&_[role=slider]]:bg-red-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Voltage Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Voltage Thresholds</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-gray-400 text-sm">Minimum Safe Voltage</Label>
                <span className="text-purple-400 font-medium">{formData.voltage_min_threshold}V</span>
              </div>
              <Slider
                value={[formData.voltage_min_threshold]}
                onValueChange={(val) => setFormData({ ...formData, voltage_min_threshold: val[0] })}
                min={300}
                max={380}
                step={5}
                className="[&_[role=slider]]:bg-purple-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-gray-400 text-sm">Maximum Safe Voltage</Label>
                <span className="text-purple-400 font-medium">{formData.voltage_max_threshold}V</span>
              </div>
              <Slider
                value={[formData.voltage_max_threshold]}
                onValueChange={(val) => setFormData({ ...formData, voltage_max_threshold: val[0] })}
                min={400}
                max={450}
                step={5}
                className="[&_[role=slider]]:bg-purple-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Units */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold">Display Units</h3>
          </div>
          <div>
            <Label className="text-gray-400 text-sm">Temperature Unit</Label>
            <Select
              value={formData.unit_temperature}
              onValueChange={(val) => setFormData({ ...formData, unit_temperature: val })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Battery className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-semibold">EV Battery Shield</span>
          </div>
          <p className="text-xs text-gray-500">Version 1.0.0</p>
          <p className="text-xs text-gray-600 mt-1">Protecting your EV battery health</p>
        </motion.div>
      </div>
    </div>
  );
}