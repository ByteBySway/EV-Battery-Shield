import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AlertPopup({ alert, onDismiss, soundEnabled }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (alert && soundEnabled) {
      // Create a simple beep sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = alert.severity === 'critical' ? 800 : 500;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
      } catch (e) {
        console.log('Audio not supported');
      }
    }
  }, [alert, soundEnabled]);

  if (!alert || !show) return null;

  const severityConfig = {
    info: { bg: 'from-blue-600 to-blue-800', border: 'border-blue-400' },
    warning: { bg: 'from-amber-600 to-amber-800', border: 'border-amber-400' },
    critical: { bg: 'from-red-600 to-red-800', border: 'border-red-400' }
  };

  const config = severityConfig[alert.severity] || severityConfig.info;

  const handleDismiss = () => {
    setShow(false);
    setTimeout(() => onDismiss(), 300);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div className={`bg-gradient-to-r ${config.bg} ${config.border} border-2 rounded-2xl p-4 shadow-2xl`}>
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg capitalize">
                  {alert.type?.replace('_', ' ')} Alert
                </h4>
                <p className="text-white/90 text-sm mt-1">{alert.message}</p>
                {alert.value && (
                  <p className="text-white/70 text-xs mt-2">
                    Current: {alert.value} | Threshold: {alert.threshold}
                  </p>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handleDismiss}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}