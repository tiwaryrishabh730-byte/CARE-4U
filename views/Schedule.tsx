
import React, { useState } from 'react';
import { Medication } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Check, Clock, Plus, Droplets, Footprints, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const Schedule: React.FC<{ medications: Medication[]; onToggle: (id: string) => void; onAdd: (med: Medication) => void }> = ({ medications, onToggle, onAdd }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    time: '08:00 AM',
    category: 'medicine'
  });

  const handleTake = (id: string, alreadyTaken: boolean) => {
    if (!alreadyTaken) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });
    }
    onToggle(id);
  };

  const handleAddNew = () => {
    if (!newMed.name || !newMed.dosage || !newMed.time) return;
    
    const hour = parseInt(newMed.time.split(':')[0]);
    const isPM = newMed.time.includes('PM');
    let slot: Medication['timeSlot'] = 'Morning';
    if (isPM) {
      if (hour >= 12 || hour < 5) slot = 'Noon';
      if (hour >= 5 && hour < 9) slot = 'Evening';
      if (hour >= 9) slot = 'Night';
    }

    const med: Medication = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMed.name,
      dosage: newMed.dosage,
      time: newMed.time,
      timeSlot: slot,
      taken: false,
      color: newMed.category === 'medicine' ? 'emerald' : newMed.category === 'water' ? 'blue' : 'amber',
      category: newMed.category as any
    };
    onAdd(med);
    setShowAddModal(false);
    setNewMed({ name: '', dosage: '', time: '08:00 AM', category: 'medicine' });
  };

  const getIcon = (category: string = 'medicine') => {
    switch (category) {
      case 'water': return <Droplets size={32} />;
      case 'walk': return <Footprints size={32} />;
      default: return <Pill size={32} />;
    }
  };

  const uniqueTimes = Array.from(new Set(medications.map(m => m.time))).sort((a, b) => {
    const timeA = new Date(`01/01/2000 ${a}`).getTime();
    const timeB = new Date(`01/01/2000 ${b}`).getTime();
    return timeA - timeB;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-4xl font-extrabold tracking-tight">Schedule</h1>
          <p className="text-slate-400 mt-2">Personal health timeline.</p>
        </motion.div>
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass px-6 py-4 rounded-3xl flex items-center gap-4 bg-emerald-500/5 border-emerald-500/20 shadow-xl"
          >
              <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {medications.filter(m => m.taken).length}/{medications.length}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Done</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-emerald-500 font-bold flex items-center gap-2">
                  <Check size={20} />
                  Tracked
              </div>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddModal(true)}
            className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 transition-all"
          >
            <Plus size={28} />
          </motion.button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative pl-10 md:pl-20 space-y-12"
      >
        <div className="absolute left-[47px] md:left-[87px] top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-500/50 via-slate-800 to-slate-800 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]" />

        {uniqueTimes.map((timeStr) => {
          const slotMeds = medications.filter(m => m.time === timeStr);
          return (
            <div key={timeStr} className="relative">
              <div className="absolute -left-[58px] md:-left-[98px] top-0 flex flex-col items-center">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="w-10 h-10 md:w-14 md:h-14 rounded-full glass border-white/20 flex items-center justify-center z-10 bg-slate-900 shadow-2xl"
                 >
                    <Clock size={24} className="text-emerald-400" />
                 </motion.div>
              </div>

              <div className="space-y-4">
                <motion.h3 variants={item} className="text-2xl font-black text-white flex items-center gap-4">
                    {timeStr}
                    <span className="h-px flex-1 bg-white/10" />
                </motion.h3>

                <div className="grid gap-4">
                  {slotMeds.map((med) => (
                    <motion.div
                      key={med.id}
                      variants={item}
                      whileHover={{ scale: 1.01 }}
                      className={`glass rounded-[2.5rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all border-l-8 shadow-lg ${med.taken ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 bg-white/5'}`}
                    >
                      <div className="flex items-center gap-6">
                        <motion.div 
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors shadow-inner ${med.taken ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}
                        >
                           {getIcon(med.category)}
                        </motion.div>
                        <div>
                          <h4 className={`text-xl font-bold transition-all ${med.taken ? 'text-emerald-400 opacity-60 line-through' : 'text-slate-100'}`}>
                            {med.name}
                          </h4>
                          <p className="text-slate-500 font-medium">{med.dosage} • {med.category || 'task'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <AnimatePresence mode="wait">
                          {med.taken ? (
                             <motion.button 
                               key="done"
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               onClick={() => onToggle(med.id)}
                               className="flex items-center gap-2 text-emerald-500 font-bold px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-inner"
                             >
                               <Check size={20} />
                               Done
                             </motion.button>
                          ) : (
                             <motion.button
                               key="todo"
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               whileTap={{ scale: 0.9 }}
                               onClick={() => handleTake(med.id, med.taken)}
                               className="px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
                             >
                               Complete
                             </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="glass max-w-md w-full rounded-[3.5rem] p-10 space-y-8 relative border-white/10 shadow-[0_0_100px_rgba(16,185,129,0.15)]"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
                <X size={28} />
              </button>
              
              <div className="text-center">
                <h2 className="text-3xl font-black">Add Task</h2>
                <p className="text-slate-500 font-medium">Build your healthy routine.</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-2 p-1.5 glass rounded-[1.5rem] overflow-hidden shadow-inner">
                  {(['medicine', 'water', 'walk'] as const).map(cat => (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewMed(prev => ({ ...prev, category: cat }))}
                      className={`flex-1 py-3 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${newMed.category === cat ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:bg-white/5'}`}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Task Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Morning Meds" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-emerald-500/10 font-bold transition-all"
                    value={newMed.name}
                    onChange={e => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Dosage</label>
                    <input 
                      type="text" 
                      placeholder="10mg" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-emerald-500/10 font-bold transition-all"
                      value={newMed.dosage}
                      onChange={e => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Time</label>
                    <input 
                      type="text" 
                      placeholder="08:00 AM" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-emerald-500/10 font-bold transition-all"
                      value={newMed.time}
                      onChange={e => setNewMed(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddNew}
                className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 transition-all flex items-center justify-center gap-3"
              >
                ADD TO SCHEDULE <Plus size={20} />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Schedule;
