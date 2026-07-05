import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export default function EmergencyHelpline() {
  const helplinesByCountry = [
    {
      country: "India",
      flag: "🇮🇳",
      helplines: [
        { number: "1033", label: "National Highway Authority Helpline" },
        { number: "1073", label: "Road Accident Emergency Service" },
        { number: "1800-111-515", label: "Motor Vehicles Department" }
      ]
    },
    {
      country: "United States",
      flag: "🇺🇸",
      helplines: [
        { number: "202-366-4000", label: "NHTSA Vehicle Safety Hotline" },
        { number: "1-888-327-4236", label: "DOT Transportation Hotline" },
        { number: "511", label: "Travel & Road Condition Info" }
      ]
    },
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      helplines: [
        { number: "0300-123-5000", label: "Driver and Vehicle Standards Agency" },
        { number: "0343-222-1234", label: "Highways England" },
        { number: "999", label: "Emergency Services" }
      ]
    },
    {
      country: "Germany",
      flag: "🇩🇪",
      helplines: [
        { number: "+49-800-6683663", label: "ADAC Breakdown Service" },
        { number: "110", label: "Police Emergency" },
        { number: "112", label: "Fire & Rescue Emergency" }
      ]
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      helplines: [
        { number: "13-11-22", label: "NRMA Roadside Assistance" },
        { number: "000", label: "Emergency Services" },
        { number: "131-444", label: "Police Assistance Line" }
      ]
    },
    {
      country: "China",
      flag: "🇨🇳",
      helplines: [
        { number: "12122", label: "Highway Emergency Hotline" },
        { number: "110", label: "Police Emergency" },
        { number: "119", label: "Fire Emergency" }
      ]
    },
    {
      country: "Japan",
      flag: "🇯🇵",
      helplines: [
        { number: "#9110", label: "Road Emergency Information" },
        { number: "110", label: "Police Emergency" },
        { number: "119", label: "Fire & Ambulance" }
      ]
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      helplines: [
        { number: "1-888-333-0371", label: "Transport Canada Safety" },
        { number: "511", label: "Road Conditions & Travel Info" },
        { number: "911", label: "Emergency Services" }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-red-900/30 to-gray-900 rounded-xl p-4 border border-red-700/30"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
          <Phone className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Emergency Helplines</h3>
          <p className="text-gray-500 text-xs">Transportation & Highway Assistance</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {helplinesByCountry.map((countryData, idx) => (
          <div key={idx} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{countryData.flag}</span>
              <h4 className="text-white font-semibold text-sm">{countryData.country}</h4>
            </div>
            
            <div className="space-y-1.5 ml-7">
              {countryData.helplines.map((helpline, hIdx) => (
                <a
                  key={hIdx}
                  href={`tel:${helpline.number}`}
                  className="block bg-gray-800/50 rounded-md p-2 border border-red-700/20 hover:bg-gray-800 hover:border-red-600/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">{helpline.label}</p>
                    <p className="text-red-400 font-bold text-xs">{helpline.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
        🚨 Call immediately if you notice smoke, unusual heat, or burning smell from your EV battery
      </p>
    </motion.div>
  );
}