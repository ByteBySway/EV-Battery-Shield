import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, TrendingUp, AlertTriangle, Leaf, Battery, Thermometer } from 'lucide-react';

const prompts = [
  { icon: Battery, text: "Give me a full battery health analysis", color: "text-emerald-400" },
  { icon: AlertTriangle, text: "What is thermal runaway and am I at risk?", color: "text-red-400" },
  { icon: Thermometer, text: "Is my temperature and voltage safe right now?", color: "text-amber-400" },
  { icon: TrendingUp, text: "What do my current trends predict?", color: "text-purple-400" },
  { icon: Leaf, text: "How do I maximize battery lifespan?", color: "text-green-400" },
  { icon: HelpCircle, text: "What charging habits should I follow?", color: "text-cyan-400" },
];

export default function QuickPrompts({ onSelect }) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs text-gray-500 mb-3">Quick questions:</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-full text-xs text-gray-300 transition-colors"
          >
            <prompt.icon className={`w-3 h-3 ${prompt.color}`} />
            {prompt.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}