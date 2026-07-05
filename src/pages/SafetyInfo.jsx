import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, AlertTriangle, ShieldCheck, Zap, Thermometer, BatteryWarning, CheckCircle2, Leaf, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function SafetyInfo() {
  const causes = [
    {
      icon: Thermometer,
      title: "Overheating",
      description: "Excessive heat from fast charging, high ambient temperatures, or cooling system failure can lead to thermal runaway.",
      prevention: "Monitor temperature continuously, avoid charging in extreme heat, ensure proper ventilation."
    },
    {
      icon: Zap,
      title: "Overcharging",
      description: "Charging beyond safe voltage limits stresses the cathode and can cause electrolyte decomposition and gas buildup.",
      prevention: "Use smart charging systems, set charge limits to 80%, never exceed manufacturer specifications."
    },
    {
      icon: BatteryWarning,
      title: "Internal Short Circuits",
      description: "Dendrite formation, separator failure, or manufacturing defects can cause internal shorts leading to rapid heating.",
      prevention: "Early detection through voltage monitoring, avoid deep discharges, regular battery health checks."
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Reduced Fire Risk",
      description: "Early detection prevents thermal runaway before it escalates into dangerous situations."
    },
    {
      icon: TrendingUp,
      title: "Extended Battery Lifespan",
      description: "Maintaining optimal conditions adds years to battery life and preserves capacity."
    },
    {
      icon: ShieldCheck,
      title: "Enhanced EV Safety",
      description: "Continuous monitoring ensures safe operation and protects vehicle occupants."
    },
    {
      icon: Leaf,
      title: "Sustainable Transportation",
      description: "Longer-lasting batteries reduce waste and support environmental goals."
    }
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
            <h1 className="text-xl font-bold text-white">Battery Safety Science</h1>
            <p className="text-xs text-gray-500">Understanding & prevention</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-900/20 to-gray-900 rounded-xl p-6 border border-red-700/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Why EV Battery Fires Occur</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            EV battery fires are caused by <span className="text-red-400 font-semibold">overheating</span>, <span className="text-red-400 font-semibold">overcharging</span>, and <span className="text-red-400 font-semibold">internal short circuits</span>. 
            These conditions trigger thermal runaway—a chain reaction where rising temperature causes accelerated chemical reactions, generating more heat until the battery catches fire.
          </p>
          <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
            <p className="text-emerald-300 text-sm">
              ✓ <span className="font-semibold">Early detection and timely cutoff</span> can prevent thermal runaway and ensure battery safety.
            </p>
          </div>
        </motion.div>

        {/* Main Causes */}
        <div>
          <h3 className="text-white font-semibold mb-4">Primary Risk Factors</h3>
          <div className="space-y-3">
            {causes.map((cause, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <cause.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{cause.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{cause.description}</p>
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-2">
                      <p className="text-blue-300 text-xs">
                        <span className="font-semibold">Prevention:</span> {cause.prevention}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How Early Detection Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-900/20 to-gray-900 rounded-xl p-5 border border-emerald-700/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-emerald-400" />
            <h3 className="text-white font-semibold">How EV Battery Shield Protects You</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-300 text-sm font-medium">Continuous Real-Time Monitoring</p>
                <p className="text-gray-500 text-xs">Tracks temperature, voltage, and current every 5 seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-300 text-sm font-medium">Intelligent Alert System</p>
                <p className="text-gray-500 text-xs">Warns you before conditions become dangerous</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-300 text-sm font-medium">Actionable Recommendations</p>
                <p className="text-gray-500 text-xs">Clear instructions on what to do when alerts trigger</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-300 text-sm font-medium">Predictive Analysis</p>
                <p className="text-gray-500 text-xs">Identifies potential issues before they escalate</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact & Benefits */}
        <div>
          <h3 className="text-white font-semibold mb-4">Impact & Benefits</h3>
          <div className="grid grid-cols-1 gap-3">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-emerald-900/20 to-gray-900 rounded-xl p-4 border border-emerald-700/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/30 to-gray-900 rounded-xl p-5 border border-blue-700/30 text-center"
        >
          <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">Stay Protected</h3>
          <p className="text-gray-400 text-sm mb-4">
            Regular monitoring and following safety recommendations can prevent 95% of battery-related incidents.
          </p>
          <Link to={createPageUrl('Dashboard')}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Return to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}