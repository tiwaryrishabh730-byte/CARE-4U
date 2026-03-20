
import React, { useEffect, useState } from 'react';
import { Vital } from '../types';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplets, Zap, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';

const WatchView: React.FC<{ vitals: Vital[]; theme: string }> = ({ vitals, theme }) => {
  const [ecgPoints, setEcgPoints] = useState<number[]>([]);

  // Simulate real-time ECG signal
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgPoints(prev => {
        const next = Math.random() * 50 + (Math.random() > 0.9 ? 80 : 0);
        return [...prev.slice(-40), next];
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getVital = (type: string) => vitals.find(v => v.type === type);

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Health Command</h1>
          <p className="text-slate-500 font-medium">Synced with CARE4U Watch Pro</p>
        </div>
        <div className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-widest text-xs">
           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
           Live Data Stream
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ECG Monitor */}
        <div className="lg:col-span-2 glass rounded-[3rem] p-10 relative overflow-hidden h-[400px]">
          <div className="absolute top-10 left-10 z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Lead II Cardiac Monitor</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black">{getVital('heart_rate')?.value}</span>
              <span className="text-xl opacity-50 font-bold">BPM</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-end">
            <svg viewBox="0 0 400 200" className="w-full h-64 overflow-visible">
              <path
                d={ecgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 10} ${150 - p}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinejoin="round"
                className="transition-all duration-100 ease-linear"
              />
              <motion.circle 
                cx={ecgPoints.length * 10} 
                cy={150 - (ecgPoints[ecgPoints.length-1] || 0)} 
                r="4" 
                fill="#10b981" 
                className="filter blur-[2px]" 
              />
            </svg>
          </div>
          
          <div className="absolute bottom-10 right-10 flex gap-4">
             <div className="glass p-4 rounded-2xl bg-white/5">
                <div className="text-[10px] font-bold opacity-50 uppercase mb-1">ST-Segment</div>
                <div className="font-black text-emerald-500">Normal</div>
             </div>
             <div className="glass p-4 rounded-2xl bg-white/5">
                <div className="text-[10px] font-bold opacity-50 uppercase mb-1">Rhythm</div>
                <div className="font-black text-emerald-500">Sinus</div>
             </div>
          </div>
        </div>

        {/* Other Vitals */}
        <div className="space-y-4">
          <VitalCard icon={<Droplets className="text-blue-400"/>} label="SpO2" value="98" unit="%" trend="+1%" />
          <VitalCard icon={<Zap className="text-amber-400"/>} label="Blood Pressure" value="118/79" unit="mmHg" trend="Stable" />
          <VitalCard icon={<ShieldCheck className="text-indigo-400"/>} label="Stress" value="12" unit="%" trend="Low" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricBox label="Daily Steps" value="8,432" target="10k" icon={<TrendingUp/>}/>
        <MetricBox label="Active Minutes" value="45" target="60" icon={<Activity/>}/>
        <MetricBox label="Sleep" value="7.4" target="8.0" unit="h" icon={<AlertCircle/>}/>
        <MetricBox label="Hydration" value="1.8" target="2.5" unit="L" icon={<Droplets/>}/>
      </div>
    </div>
  );
};

const VitalCard = ({ icon, label, value, unit, trend }: any) => (
  <div className="glass rounded-[2rem] p-6 flex items-center justify-between border-white/5 hover:bg-white/5 transition-all">
    <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-white/5">{icon}</div>
        <div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-widest">{label}</div>
            <div className="text-2xl font-black">{value}<span className="text-sm font-bold opacity-30 ml-1">{unit}</span></div>
        </div>
    </div>
    <div className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500">{trend}</div>
  </div>
);

const MetricBox = ({ label, value, target, unit = '', icon }: any) => (
  <div className="glass rounded-[2.5rem] p-8 border-white/5 text-center space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center opacity-60">{icon}</div>
    <div>
        <div className="text-4xl font-black">{value}{unit}</div>
        <div className="text-xs font-bold opacity-40 uppercase tracking-widest">{label}</div>
    </div>
    <div className="text-xs font-medium text-slate-500">Goal: {target}{unit}</div>
  </div>
);

export default WatchView;
