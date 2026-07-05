import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, BellOff, Filter, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AlertCard from '@/components/alerts/AlertCard';
import EmergencyHelpline from '@/components/safety/EmergencyHelpline';

export default function Alerts() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date', 50)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Alert.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['alerts'])
  });

  const markAllRead = async () => {
    const unread = alerts.filter(a => !a.is_read);
    for (const alert of unread) {
      await base44.entities.Alert.update(alert.id, { is_read: true });
    }
    queryClient.invalidateQueries(['alerts']);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.is_read;
    if (filter === 'critical') return alert.severity === 'critical';
    if (filter === 'warning') return alert.severity === 'warning';
    if (filter === 'resolved') return alert.is_resolved;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.is_read).length;

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
              <h1 className="text-xl font-bold text-white">Alerts</h1>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-emerald-400"
              onClick={markAllRead}
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Filters */}
        <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
          <TabsList className="bg-gray-800/50 border border-gray-700/50 p-1 w-full">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className="flex-1 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger 
              value="critical" 
              className="flex-1 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400"
            >
              Critical
            </TabsTrigger>
            <TabsTrigger 
              value="resolved" 
              className="flex-1 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              Resolved
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Emergency Helpline - shown for critical/warning alerts */}
        {filteredAlerts.some(a => a.severity === 'critical' || a.severity === 'warning') && (
          <div className="mb-4">
            <EmergencyHelpline />
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BellOff className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No alerts found</p>
                <p className="text-gray-600 text-sm">Your battery is operating safely</p>
              </motion.div>
            ) : (
              filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onMarkRead={(id) => updateMutation.mutate({ id, data: { is_read: true } })}
                  onResolve={(id) => updateMutation.mutate({ id, data: { is_resolved: true } })}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}