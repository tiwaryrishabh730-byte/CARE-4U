
import React from 'react';
import { AppState } from '../types';
import { motion } from 'framer-motion';
import { Activity, Flame, CheckCircle2, ChevronRight, Check } from 'lucide-react';

const HistoryView: React.FC<{ state: AppState }> = ({ state }) => {
  const dates = [
    { day: 'SUN', num: '1', active: true },
    { day: 'SAT', num: '31', active: false },
    { day: 'FRI', num: '30', active: false },
    { day: 'THU', num: '29', active: false },
    { day: 'WED', num: '28', active: false },
    { day: 'TUE', num: '27', active: false },
  ];

  return (
    <div className="p-6 md:p-12 max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black tracking-tight">History</h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Review Your Progress</p>
      </div>

      {/* Calendar Strip */}
      <div className="flex justify-between items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {dates.map((d, i) => (
          <div key={i} className={`flex flex-col items-center justify-center w-14 h-20 rounded-full transition-all ${
            d.active ? 'bg-white text-slate-950 scale-110 shadow-xl' : 'glass text-slate-500'
          }`}>
            <span className="text-[8px] font-black">{d.day}</span>
            <span className="text-lg font-black">{d.num}</span>
          </div>
        ))}
      </div>

      {/* Medicine Adherence Card */}
      <div className="glass rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Check size={20} strokeWidth={3} />
          </div>
          <h3 className="text-lg font-black text-slate-100">Medicine Adherence</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-slate-500">Morning Dose</span>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">
              Taken 8:05 AM
            </div>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-slate-500">Night Dose</span>
            <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-wider">
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-[2rem] p-6 bg-indigo-600/20 border-indigo-500/20 relative overflow-hidden group">
          <div className="p-3 rounded-2xl bg-indigo-500/20 w-fit mb-6">
            <Activity size={20} className="text-indigo-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-white">6,420</div>
            <div className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Steps Today</div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Activity size={48} />
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6 bg-slate-800/40 border-slate-700/50 relative overflow-hidden group">
          <div className="p-3 rounded-2xl bg-slate-700/50 w-fit mb-6">
            <Flame size={20} className="text-slate-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-white">1.2k</div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cals Burned</div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Flame size={48} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default HistoryView;
