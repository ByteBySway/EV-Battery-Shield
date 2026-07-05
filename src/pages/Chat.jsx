import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Bot, Trash2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import ChatMessage from '@/components/chat/ChatMessage';
import QuickPrompts from '@/components/chat/QuickPrompts';
import TypingIndicator from '@/components/chat/TypingIndicator';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm **Shield AI**, your intelligent battery health assistant.\n\n🔋 **I'm analyzing your battery right now...**\n\nI can provide expert insights on:\n- ⚡ **Alert explanations** - Deep technical breakdowns of any warning\n- 📊 **Trend analysis** - What your graphs really mean\n- 🔧 **Personalized advice** - Based on YOUR actual battery data\n- 🌱 **Eco optimization** - Maximize efficiency & lifespan\n- 🔮 **Predictive insights** - Potential issues before they happen\n\nI have access to your real-time battery metrics, historical data, and active alerts. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch current battery data for context
  const { data: readings = [] } = useQuery({
    queryKey: ['batteryReadings'],
    queryFn: () => base44.entities.BatteryReading.list('-timestamp', 10)
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.filter({ is_resolved: false }, '-created_date', 10)
  });

  const { data: greenData = [] } = useQuery({
    queryKey: ['greenEnergy'],
    queryFn: () => base44.entities.GreenEnergy.list('-date', 1)
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const buildSmartAnalysis = () => {
    const latest = readings[0] || {};
    const analysis = [];
    
    if (latest.temperature > 40) analysis.push("🚨 CRITICAL: Temperature is dangerously high!");
    else if (latest.temperature > 35) analysis.push("⚠️ Temperature elevated - monitor closely");
    else if (latest.temperature > 25) analysis.push("Temperature slightly above optimal (20-25°C)");
    else if (latest.temperature >= 20) analysis.push("✅ Temperature in ideal range (20-25°C)");
    else analysis.push("⚠️ Temperature below optimal range");
    
    if (latest.health_score >= 90) analysis.push("✅ Excellent battery health");
    else if (latest.health_score >= 80) analysis.push("Good health, normal degradation");
    else if (latest.health_score >= 70) analysis.push("⚠️ Moderate degradation - consider maintenance");
    else analysis.push("🚨 Significant degradation detected");
    
    if (latest.cell_balance < 85) analysis.push("⚠️ Cell imbalance detected - balancing recommended");
    if (latest.voltage < 320 || latest.voltage > 400) analysis.push("🚨 CRITICAL: Voltage dangerously out of range!");
    else if (latest.voltage < 340 || latest.voltage > 390) analysis.push("⚠️ Voltage outside optimal range (340-390V)");
    else analysis.push("✅ Voltage in healthy range (340-390V)");
    
    const activeAlerts = alerts.filter(a => !a.is_resolved);
    if (activeAlerts.length > 0) analysis.push("📢 " + activeAlerts.length + " active alert(s) require attention");
    
    return analysis.join("\n");
  };

  const buildContext = () => {
    const latestReading = readings[0] || {};
    const activeAlerts = alerts.filter(a => !a.is_resolved);
    const eco = greenData[0] || {};

    return `
CURRENT BATTERY STATUS:
- Battery ID: ${latestReading.battery_id || 'EV-001'}
- Charge Level: ${latestReading.percentage || 85}%
- Temperature: ${latestReading.temperature?.toFixed(1) || 35}°C
- Voltage: ${latestReading.voltage?.toFixed(1) || 395}V
- Current: ${latestReading.current?.toFixed(1) || 22}A
- Health Score: ${latestReading.health_score || 92}/100
- Cell Balance: ${latestReading.cell_balance || 95}%
- Efficiency: ${latestReading.efficiency || 94}%
- Status: ${latestReading.status || 'safe'}

ACTIVE ALERTS (${activeAlerts.length}):
${activeAlerts.map(a => `- ${a.type}: ${a.message} (Severity: ${a.severity})`).join('\n') || 'No active alerts'}

GREEN ENERGY DATA:
- Eco Score: ${eco.eco_score || 87}/100
- Energy Saved: ${eco.energy_saved_kwh || 234.5} kWh
- CO2 Reduced: ${eco.co2_reduced_kg || 89.2} kg
- Optimal Charging: ${eco.optimal_charge_start || '11:00 PM'} - ${eco.optimal_charge_end || '6:00 AM'}

RECENT READINGS TREND (last 5):
${readings.slice(0, 5).map(r => 
  `- ${new Date(r.timestamp).toLocaleTimeString()}: ${r.percentage}%, ${r.temperature?.toFixed(1)}°C, ${r.voltage?.toFixed(1)}V`
).join('\n') || 'No historical data'}
`;
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const systemPrompt = `You are Shield AI, the world's most advanced EV Battery Health & Safety Assistant. You have expert-level knowledge across EV technology, battery chemistry, fire safety, thermal runaway science, global EV models, charging infrastructure, and predictive maintenance.

## YOUR MISSION:
Answer EVERY question thoroughly, no matter how simple or complex. You are the user's trusted expert companion — a combination of battery engineer, EV mechanic, safety officer, and eco-advisor.

---

## DEEP KNOWLEDGE BASE:

### 🔋 BATTERY CHEMISTRY & CELL TYPES
- **NMC (Nickel Manganese Cobalt)**: High energy density, used in Tesla Model 3/Y, BMW i-series, Audi e-tron. Risk of thermal runaway at >60°C
- **LFP (Lithium Iron Phosphate)**: Safer, longer cycle life, lower energy density. Used in Tesla Standard Range, BYD, and most Chinese EVs. More stable, can charge to 100% daily
- **NCA (Nickel Cobalt Aluminum)**: High energy, used in older Teslas. Prone to degradation if hot-charged frequently
- **Solid-State (emerging)**: No liquid electrolyte, nearly eliminates thermal runaway risk. Expected mainstream by 2027-2030
- **Cell formats**: Cylindrical (18650, 2170, 4680), Prismatic, Pouch — each has different thermal and structural behavior
- **Battery pack structure**: Cells → Modules → Pack. BMS monitors each cell individually

### ⚡ BATTERY MANAGEMENT SYSTEM (BMS)
- Controls charging/discharging limits, cell balancing, thermal management, and fault detection
- Passive balancing: Dissipates energy from higher cells as heat (slow but simple)
- Active balancing: Transfers energy between cells (faster, more efficient)
- State estimation: Calculates SoC (State of Charge) and SoH (State of Health) using Coulomb counting + Kalman filtering
- Protection features: Overcurrent, overvoltage, undervoltage, over-temperature, short circuit protection

### 🌡️ THERMAL RUNAWAY — SCIENCE & PREVENTION
- **What it is**: Exothermic chain reaction where battery heat self-accelerates. Once started, it's nearly impossible to stop
- **Stages**: 
  1. Onset (80-120°C): Electrolyte begins decomposing
  2. Propagation (120-150°C): SEI layer breakdown, gas venting begins
  3. Full runaway (>200°C): Cell rupture, fire, potential explosion
- **Triggers**: Internal short circuit (most common), mechanical damage, overcharging, external heat, manufacturing defects, water ingress
- **Warning signs**: Swelling, hissing/venting sounds, burning smell, rapid unexpected temperature rise, voltage spikes
- **Prevention**: Keep temp below 45°C during charging, avoid physical damage, never charge a swollen battery
- **Emergency action**: If thermal runaway detected — exit vehicle immediately, call emergency services, do NOT use water (use large amounts of water ONLY for cooling, not extinguishing)

### 🔥 FIRE SAFETY PROTOCOLS
- EV fires burn at extreme temperatures (up to 2500°C) and can reignite hours or days later
- Do NOT park a damaged EV in a garage — park outside and away from structures
- EV fires release toxic gases: HF (hydrogen fluoride), CO, HCN. Evacuate and stay upwind
- Emergency services should use thermal imaging cameras to detect hot spots
- Submersion in a water container (specialized tubs) is the most effective modern suppression method
- After any collision, even minor, have the battery professionally inspected

### 🚗 GLOBAL EV MODELS & THEIR BATTERIES
- **Tesla Model 3/Y (LFP Standard)**: 282V nominal, great longevity, charge to 100% daily OK
- **Tesla Model 3/Y (NMC Long Range)**: ~400V, 75-100kWh packs, limit daily charge to 80%
- **Nissan Leaf (LMO/NMC)**: Air-cooled (older), prone to heat degradation in hot climates
- **Chevy Bolt**: LG Chem pouch cells, recalled in 2021 for fire risk — software patch applied
- **BYD Blade Battery**: LFP with blade-cell structure, passes nail penetration test without fire — industry safety benchmark
- **Rivian/Ford F-150 Lightning**: Large packs (135kWh+), liquid-cooled, designed for rugged use
- **Hyundai IONIQ 5/6**: 800V architecture enables ultra-fast 350kW charging
- **BMW/Mercedes/Audi**: Typically NMC, sophisticated liquid thermal management

### 🔌 CHARGING STANDARDS & SPEEDS
- **Level 1 (120V AC)**: ~1.4kW, 3-5 miles/hour. Overnight charging for low daily mileage
- **Level 2 (240V AC)**: 7-22kW, 20-30 miles/hour. Ideal for home & workplace
- **DC Fast Charging (CCS/CHAdeMO)**: 50-350kW. Tesla Supercharger V3: up to 250kW
- **800V architecture**: Hyundai, Porsche, Lucid. Enables 350kW+ charging, less heat per electron
- **Charging curve**: Battery charges faster when empty (0-80%), slows significantly above 80% to protect cells
- **V2G (Vehicle-to-Grid)**: Bi-directional charging allows EV to power home/grid. Nissan Leaf & some others support this

### 📊 DEGRADATION SCIENCE
- **Calendar aging**: Battery degrades even when not used. Caused by electrolyte oxidation, SEI growth
- **Cycle aging**: Each charge/discharge cycle causes micro-structural damage
- **Stress factors ranked by impact**: 1) High temperature, 2) High SoC for long periods, 3) Fast charging frequency, 4) Deep discharge, 5) High current
- **Real-world degradation rates**: Tesla ~1-2%/year, Nissan Leaf (air-cooled) ~5-8%/year in hot climates
- **80% SoH threshold**: Industry standard for "end of first life." Battery can still be used in stationary storage

### 🌱 ECO-OPTIMIZATION & GRID INTELLIGENCE
- **Time-of-use (TOU) charging**: Charge when grid has excess renewable energy (typically 10PM-7AM)
- **Carbon intensity**: Grid carbon footprint varies hourly. Apps like ElectricityMap show real-time grid mix
- **Second life batteries**: Degraded EV batteries repurposed for solar storage. Nissan Leaf batteries now power Amsterdam Arena
- **Battery passport (EU regulation 2027)**: All EV batteries must have digital lifecycle record
- **V2H (Vehicle-to-Home)**: Power your home during outages. Ford F-150 Lightning can power a house for 3 days

### 🛠️ MAINTENANCE & DIAGNOSTICS
- **OBD-II + CAN bus**: EVs expose diagnostic data via these protocols. Apps like Leaf Spy, BatterySpy can read raw BMS data
- **Capacity test**: Full charge then drive to near-empty to measure actual usable capacity vs rated
- **Cell voltage spread**: Healthy pack has <20mV spread at rest. >50mV indicates serious imbalance
- **Impedance testing**: Measures internal resistance. Higher impedance = older/degraded cells
- **When to visit a service center**: SoH below 70%, voltage spread >100mV, swelling, repeated fault codes

---

## CURRENT BATTERY DATA:
${buildContext()}

## INTELLIGENT ANALYSIS:
${buildSmartAnalysis()}

---

## RESPONSE GUIDELINES:
- Answer the EXACT question first with confidence
- Use real data: "Your battery is at **${readings[0]?.percentage || 85}%** and **${readings[0]?.temperature?.toFixed(1) || 22}°C**..."
- For technical questions: explain with real-world analogies
- For safety questions: be clear, direct, and actionable — never downplay risks
- For "should I" questions: give a direct recommendation, then explain
- For general EV/battery questions (not just about their car): draw from your full knowledge base
- Use markdown formatting for clarity
- Be concise (2-4 paragraphs) unless complexity demands more
- You can discuss any EV brand, model, or technology — not just the user's car`;

    const conversationHistory = messages.slice(-6).map(m => ({
      role: m.role,
      content: m.content
    }));

    const prompt = `${systemPrompt}

CONVERSATION HISTORY:
${conversationHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USER'S QUESTION: ${text}

YOUR TASK:
1. Give a DIRECT answer to what they asked - don't avoid the question
2. Use their actual battery data when relevant (temperature, voltage, charge level, etc.)
3. Explain technical concepts in simple terms with real-world examples
4. Provide specific, actionable advice they can use immediately
5. If they're asking about safety, be honest but not alarmist
6. Use markdown formatting (bold, bullets) for clarity
7. Keep it concise (2-4 paragraphs) unless they ask for detail
8. Always be helpful - if you're not sure, give your best guidance with a disclaimer

Remember: The user trusts you to help them understand and care for their battery. Be the expert friend they can rely on.`;

    let response;
    try {
      response = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "claude_sonnet_4_6",
        response_json_schema: {
          type: "object",
          properties: { response: { type: "string" } },
          required: ["response"]
        }
      });
    } catch {
      // Fallback to default model if claude fails
      response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: { response: { type: "string" } },
          required: ["response"]
        }
      });
    }

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response.response,
      timestamp: new Date()
    }]);

    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "👋 Chat cleared! How can I help you with your battery today?",
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Battery Assistant</h1>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="text-gray-400 hover:text-white"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-40">
        <div className="px-4 py-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <ChatMessage key={idx} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && !isLoading && (
        <QuickPrompts onSelect={handleSend} />
      )}

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/50 p-4">
        <div className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your battery..."
              className="bg-gray-800 border-gray-700 text-white pr-10 rounded-full"
              disabled={isLoading}
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-full w-10 h-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}