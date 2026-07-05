import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Check, Flame, ShieldCheck, AlertTriangle, Eye, EyeOff, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function BeforeAfter() {
  const [activeView, setActiveView] = useState('split'); // 'split', 'before', 'after'

  const comparisonPoints = [
    {
      without: "No temperature monitoring",
      with: "Real-time thermal tracking every 5 seconds",
      icon: Flame
    },
    {
      without: "Undetected overcharging",
      with: "Voltage alerts before critical levels (390V warning)",
      icon: Zap
    },
    {
      without: "Silent cell imbalance degradation",
      with: "Early detection with balance scoring",
      icon: TrendingUp
    },
    {
      without: "No warning before thermal runaway",
      with: "Predictive alerts 20-40 minutes in advance",
      icon: AlertTriangle
    },
    {
      without: "User unaware of dangerous conditions",
      with: "Clear actionable guidance when alerts trigger",
      icon: Eye
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
            <h1 className="text-xl font-bold text-white">Before vs After</h1>
            <p className="text-xs text-gray-500">The power of awareness</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Hero Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-900/30 via-gray-900 to-emerald-900/30 rounded-2xl p-8 border border-purple-700/30 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            💡
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
            The Battery is the Same.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              The Difference is Awareness.
            </span>
          </h2>
          <p className="text-gray-400 text-sm">
            Same battery. Same chemistry. Different outcome.
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveView('before')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              activeView === 'before' 
                ? 'bg-red-900/50 text-red-300 border border-red-700/50' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🔥 Without Shield
          </button>
          <button
            onClick={() => setActiveView('split')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              activeView === 'split' 
                ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚖️ Compare
          </button>
          <button
            onClick={() => setActiveView('after')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              activeView === 'after' 
                ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🛡️ With Shield
          </button>
        </div>

        {/* Main Comparison View */}
        <AnimatePresence mode="wait">
          {activeView === 'split' && (
            <motion.div
              key="split"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-3"
            >
              {/* Without Shield */}
              <div className="bg-gradient-to-br from-red-900/20 to-gray-900 rounded-xl border border-red-700/50 p-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Without Shield</h3>
                  <p className="text-red-400 text-xs font-semibold">❌ BLIND</p>
                </div>
                <div className="space-y-2">
                  {comparisonPoints.map((point, idx) => (
                    <div key={idx} className="bg-gray-800/50 rounded-lg p-2">
                      <p className="text-gray-400 text-xs leading-relaxed">
                        <X className="w-3 h-3 inline text-red-400 mr-1" />
                        {point.without}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* With Shield */}
              <div className="bg-gradient-to-br from-emerald-900/20 to-gray-900 rounded-xl border border-emerald-700/50 p-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">With Shield</h3>
                  <p className="text-emerald-400 text-xs font-semibold">✅ AWARE</p>
                </div>
                <div className="space-y-2">
                  {comparisonPoints.map((point, idx) => (
                    <div key={idx} className="bg-gray-800/50 rounded-lg p-2">
                      <p className="text-gray-300 text-xs leading-relaxed">
                        <Check className="w-3 h-3 inline text-emerald-400 mr-1" />
                        {point.with}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'before' && (
            <motion.div
              key="before"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <div className="bg-gradient-to-br from-red-900/30 to-gray-900 rounded-2xl border-2 border-red-700/50 p-6">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 border-4 border-red-700/50"
                  >
                    <Flame className="w-12 h-12 text-red-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Without EV Battery Shield</h2>
                  <p className="text-red-400 text-lg font-semibold mb-1">❌ OPERATING BLIND</p>
                  <p className="text-gray-400 text-sm">No visibility into battery health</p>
                </div>

                <div className="space-y-3">
                  {comparisonPoints.map((point, idx) => {
                    const Icon = point.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-800/50 rounded-lg p-4 border border-red-700/30"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm font-medium mb-1 flex items-center gap-2">
                              <X className="w-4 h-4 text-red-400" />
                              {point.without}
                            </p>
                            <p className="text-red-400 text-xs">⚠️ Risk: Undetected dangerous conditions</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-center">
                  <EyeOff className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-red-300 text-sm font-semibold">
                    Thermal runaway can occur with zero warning
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'after' && (
            <motion.div
              key="after"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="bg-gradient-to-br from-emerald-900/30 to-gray-900 rounded-2xl border-2 border-emerald-700/50 p-6">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 20px rgba(16, 185, 129, 0.3)",
                        "0 0 40px rgba(16, 185, 129, 0.5)",
                        "0 0 20px rgba(16, 185, 129, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-700/50"
                  >
                    <ShieldCheck className="w-12 h-12 text-emerald-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">With EV Battery Shield</h2>
                  <p className="text-emerald-400 text-lg font-semibold mb-1">✅ FULLY AWARE</p>
                  <p className="text-gray-400 text-sm">Complete visibility & control</p>
                </div>

                <div className="space-y-3">
                  {comparisonPoints.map((point, idx) => {
                    const Icon = point.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-800/50 rounded-lg p-4 border border-emerald-700/30"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm font-medium mb-1 flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-400" />
                              {point.with}
                            </p>
                            <p className="text-emerald-400 text-xs">✓ Protection: Early warning prevents escalation</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-emerald-900/30 border border-emerald-700/50 rounded-xl text-center">
                  <Eye className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-300 text-sm font-semibold">
                    20-40 minute advance warning before critical failure
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-900/20 via-gray-900 to-yellow-900/20 rounded-xl p-5 border border-yellow-700/30"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold mb-2">Critical Insight</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                In every documented EV battery fire case, the battery itself showed warning signs hours or even days before failure. 
                The tragedy? <span className="text-yellow-400 font-semibold">No one was watching.</span>
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-yellow-700/30">
                <p className="text-yellow-300 text-xs font-medium">
                  💡 EV Battery Shield gives you what was missing: <span className="text-white">Continuous monitoring + Early alerts + Clear actions</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 text-center"
          >
            <p className="text-red-400 text-3xl font-bold mb-1">0%</p>
            <p className="text-gray-400 text-xs">Fire prevention without monitoring</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-900/20 border border-emerald-700/50 rounded-xl p-4 text-center"
          >
            <p className="text-emerald-400 text-3xl font-bold mb-1">85-95%</p>
            <p className="text-gray-400 text-xs">Fire prevention with early warning</p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-xl p-6 border border-blue-700/30 text-center"
        >
          <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg mb-2">Same Battery. Better Outcome.</h3>
          <p className="text-gray-400 text-sm mb-4">
            Don't wait for a fire to wish you had monitoring. Start protecting your EV today.
          </p>
          <Link to={createPageUrl('Dashboard')}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              View Your Battery Status
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}