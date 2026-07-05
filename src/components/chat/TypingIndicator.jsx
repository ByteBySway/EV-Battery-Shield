import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <Bot className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="bg-gray-800 border border-gray-700/50 rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 bg-emerald-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}