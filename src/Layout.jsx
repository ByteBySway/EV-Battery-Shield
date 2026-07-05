import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Bell, BarChart2, Settings, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: Home, label: 'Home' },
    { name: 'Alerts', icon: Bell, label: 'Alerts' },
    { name: 'Chat', icon: MessageCircle, label: 'AI Chat' },
    { name: 'Graphs', icon: BarChart2, label: 'Trends' },
    { name: 'Helpline', icon: Phone, label: 'Helplines' },
    { name: 'Settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (name) => currentPageName === name;

  return (
    <div className="min-h-screen bg-gray-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        :root {
          --color-safe: #10b981;
          --color-warning: #f59e0b;
          --color-critical: #ef4444;
        }
        
        body {
          background: #030712;
          -webkit-font-smoothing: antialiased;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 2px;
        }
      `}</style>
      
      {children}
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 safe-area-pb">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={createPageUrl(item.name)}
              className="flex flex-col items-center justify-center flex-1 py-2"
            >
              <div className="relative">
                {isActive(item.name) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 bg-emerald-500/20 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <item.icon 
                  className={`w-5 h-5 relative z-10 ${
                    isActive(item.name) ? 'text-emerald-400' : 'text-gray-500'
                  }`} 
                />
              </div>
              <span 
                className={`text-xs mt-1 ${
                  isActive(item.name) ? 'text-emerald-400 font-medium' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}