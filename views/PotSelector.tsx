
import React from 'react';
import { Pot } from '../types';
import { motion } from 'framer-motion';

const PotSelector: React.FC<{ companions: Pot[]; selectedPot: Pot; onSelect: (p: Pot) => void }> = ({ companions, selectedPot, onSelect }) => {
  return (
    <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-12 h-full overflow-y-auto pb-32">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight">Companions</h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Select Your Guide</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {companions.map((pot) => (
          <motion.button
            key={pot.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(pot)}
            className={`relative flex flex-col items-center p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${
              selectedPot.id === pot.id 
              ? 'bg-[#0f172a] border-emerald-500 shadow-2xl shadow-emerald-500/10' 
              : 'glass border-transparent hover:bg-white/5'
            }`}
          >
            {/* Visual Header Decoration */}
            <div className={`absolute top-4 w-12 h-12 rounded-full blur-[20px] opacity-20`} style={{ backgroundColor: pot.color }} />
            
            {/* Animated Emoji Avatar */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="relative z-10 w-24 h-24 glass rounded-full flex items-center justify-center mb-6 shadow-inner"
            >
              <span className="text-4xl drop-shadow-lg">{pot.emoji}</span>
            </motion.div>

            <div className="text-center space-y-1 relative z-10">
              <h3 className="text-2xl font-black">{pot.name}</h3>
              <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase">{pot.subtitle}</p>
            </div>
            
            {selectedPot.id === pot.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute inset-0 border-2 border-emerald-500/50 rounded-[2.5rem] pointer-events-none"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="glass p-6 rounded-[2rem] border-dashed border-white/10 flex flex-col items-center text-center space-y-2">
         <h4 className="font-bold text-sm">Capabilities</h4>
         <p className="text-xs text-slate-500 leading-relaxed">
           Each companion has unique capabilities to help you reach your goals. Sage boosts activity, while Lotus enhances mental wellness.
         </p>
      </div>
    </div>
  );
};

export default PotSelector;
