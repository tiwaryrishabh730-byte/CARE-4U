
import React from 'react';
import { AppState } from '../types';
import { motion } from 'framer-motion';
import { Heart, Activity, TrendingUp, ChevronRight, MessageCircle, Sparkles, Droplets, Sun, Zap, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

const Home: React.FC<{ state: AppState; onAction: () => void; onNavigate: (v: AppState['currentView']) => void }> = ({ state, onAction, onNavigate }) => {
  const { selectedPot, plantName, vitals, user, medications } = state;
  const hr = vitals.find(v => v.type === 'heart_rate')?.value || 72;
  const spo2 = vitals.find(v => v.type === 'blood_oxygen')?.value || 98;
  const stress = vitals.find(v => v.type === 'stress')?.value || 12;
  const bp = vitals.find(v => v.type === 'blood_pressure')?.value || '118/79';
  
  const totalMeds = medications.length;
  const takenMeds = medications.filter(m => m.taken).length;
  const goalCompletion = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;

  const particles = Array.from({ length: 6 });

  const nextTask = [...medications]
    .filter(m => !m.taken)
    .sort((a, b) => {
      const timeA = new Date(`01/01/2000 ${a.time}`).getTime();
      const timeB = new Date(`01/01/2000 ${b.time}`).getTime();
      return timeA - timeB;
    })[0] || medications[medications.length - 1];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 pb-48"
    >
      {/* Welcome & Vitals Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-1"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Hi, <span className="text-emerald-500">{user.name || 'User'}</span>.
          </h1>
          <p className="text-slate-500 text-xl font-medium">You and <span className="text-emerald-500">{plantName || selectedPot.name}</span> are thriving.</p>
        </motion.div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto"
        >
           <VitalMiniCard label="Pulse" value={hr} unit="BPM" icon={<Heart size={14} className="text-rose-500" />} />
           <VitalMiniCard label="Oxygen" value={spo2} unit="%" icon={<Droplets size={14} className="text-blue-500" />} />
           <VitalMiniCard label="Stress" value={stress} unit="%" icon={<ShieldCheck size={14} className="text-indigo-500" />} />
           <VitalMiniCard label="Pressure" value={bp} unit="" icon={<Zap size={14} className="text-amber-500" />} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Plant Display Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 glass rounded-[4rem] p-10 md:p-16 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xs uppercase tracking-widest shadow-inner">
                <Sparkles size={14} /> {plantName || selectedPot.name}'s Spirit: Radiant
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
                "Your heart is a <span className="text-emerald-500">rhythm</span> I love to follow!"
              </h2>
              <div className="flex justify-center md:justify-start gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAction} 
                  className="px-10 py-5 rounded-3xl bg-emerald-500 text-white font-black flex items-center gap-3 shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 transition-all"
                >
                  <MessageCircle size={24} /> Talk to {plantName || selectedPot.name}
                </motion.button>
              </div>
            </div>

            <div className="relative cursor-pointer shrink-0">
              {particles.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -60, 0],
                    x: [0, (i % 2 === 0 ? 30 : -30), 0],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className="absolute w-3 h-3 bg-emerald-400 rounded-full blur-[3px] z-10"
                  style={{ top: '40%', left: '45%' }}
                />
              ))}

              <motion.div 
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-[200px] md:text-[240px] filter drop-shadow-[0_25px_50px_rgba(16,185,129,0.4)] z-20"
              >
                {selectedPot?.emoji || '🌳'}
              </motion.div>
              <div className="absolute inset-0 bg-emerald-500/15 blur-[100px] rounded-full -z-10 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Schedule Summary */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="glass rounded-[3rem] p-8 border-white/5 flex flex-col items-center text-center shadow-xl">
            <h3 className="font-black text-xs uppercase tracking-widest opacity-40 mb-8">Routine Summary</h3>
            
            <div className="relative w-48 h-48 mb-8 group">
                <svg className="w-full h-full transform -rotate-90 group-hover:scale-105 transition-transform duration-500">
                    <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <motion.circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502} initial={{ strokeDashoffset: 502 }} animate={{ strokeDashoffset: 502 - (502 * goalCompletion) / 100 }} transition={{ duration: 2, ease: "circOut" }} className="text-emerald-500" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black">{goalCompletion}%</span>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Tasks Done</span>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-500 font-bold justify-center">
                    <TrendingUp size={16} />
                    <span>{goalCompletion === 100 ? 'Peak Performance!' : `${takenMeds}/${totalMeds} Finished`}</span>
                </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('schedule')} 
            className="w-full text-left glass rounded-[3rem] p-8 transition-all cursor-pointer border-white/5 flex items-center gap-4 group shadow-lg"
          >
             <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Activity size={24} />
             </div>
             <div className="flex-1">
                <div className="font-bold">Up Next</div>
                <div className="text-xs opacity-50">{nextTask?.name} at {nextTask?.time}</div>
             </div>
             <ChevronRight className="ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Plant Vitality Section (Bottom) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="glass rounded-[4rem] p-10 md:p-12 border-white/5 overflow-hidden relative shadow-2xl"
      >
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-3xl font-black">{plantName || selectedPot?.name}'s Vitality</h3>
                  <p className="text-slate-500 text-sm font-medium">Synced with your care frequency.</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                  <VitalGauge icon={<Droplets className="text-blue-400" />} label="Water" value={selectedPot?.needs.water || 0} color="rgba(96, 165, 250, 0.2)" barColor="#60a5fa" />
                  <VitalGauge icon={<Sun className="text-amber-400" />} label="Sunlight" value={selectedPot?.needs.sunlight || 0} color="rgba(251, 191, 36, 0.2)" barColor="#fbbf24" />
                  <VitalGauge icon={<Zap className="text-emerald-400" />} label="Spirit" value={selectedPot?.needs.spirit || 0} color="rgba(16, 185, 129, 0.2)" barColor="#10b981" />
              </div>
          </div>
      </motion.div>

      {/* Settings Navigation Shortcut Button */}
      <div className="flex justify-center pt-8">
        <motion.button 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('settings')}
          className="glass px-10 py-5 rounded-[2.5rem] flex items-center gap-4 transition-all text-slate-400 hover:text-white group border-white/10 shadow-xl"
        >
          <SettingsIcon size={24} className="group-hover:rotate-90 transition-transform duration-700" />
          <span className="font-black uppercase tracking-widest text-xs">Profile & Preferences</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const VitalMiniCard = ({ label, value, unit, icon }: any) => (
  <motion.div 
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.06)" }}
    className="glass p-4 rounded-2xl flex flex-col gap-1 border-white/5 shadow-lg"
  >
     <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
     </div>
     <div className="text-xl font-black">{value}<span className="text-xs opacity-50 ml-0.5">{unit}</span></div>
  </motion.div>
);

const VitalGauge = ({ icon, label, value, color, barColor }: any) => (
    <div className="flex flex-col items-center gap-4 group">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center relative transition-all group-hover:scale-110" style={{ backgroundColor: color }}>
            {icon}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="2" fill="transparent" opacity="0.05" />
                <motion.circle cx="40" cy="40" r="36" stroke={barColor} strokeWidth="4" fill="transparent" strokeDasharray={226} initial={{ strokeDashoffset: 226 }} animate={{ strokeDashoffset: 226 - (226 * value) / 100 }} transition={{ duration: 2, ease: "circOut" }} strokeLinecap="round" />
            </svg>
        </div>
        <div className="text-center">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</div>
            <div className="text-xl font-black">{value}%</div>
        </div>
    </div>
);

export default Home;
