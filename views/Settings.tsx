
import React, { useState } from 'react';
import { AppState, UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
// Added missing UserPlus import
import { User, Shield, FileText, LifeBuoy, HelpCircle, Phone, ChevronRight, LogOut, Camera, Users, ClipboardList, Plus, X, Key, UserPlus } from 'lucide-react';

interface SettingsProps {
  state: AppState;
  onNavigate: (v: AppState['currentView']) => void;
  onAddAccount: (a: UserProfile) => void;
  onSwitchAccount: (username: string) => void;
  onSignOut: () => void;
}

const SettingsView: React.FC<SettingsProps> = ({ state, onNavigate, onAddAccount, onSwitchAccount, onSignOut }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState<UserProfile>({ name: '', username: '' });

  const sections = [
    { icon: <Shield size={20} />, label: 'Privacy Policy' },
    { icon: <FileText size={20} />, label: 'Terms and Conditions' },
    { icon: <LifeBuoy size={20} />, label: 'Support Centre' },
    { icon: <HelpCircle size={20} />, label: "Help and FAQ's" },
    { icon: <Phone size={20} />, label: 'Contact Us' },
  ];

  const handleAddAccount = () => {
    if (newAccount.name && newAccount.username) {
      onAddAccount(newAccount);
      setNewAccount({ name: '', username: '' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-10 pb-32 overflow-y-auto h-full scrollbar-hide">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manage Your Profile</p>
      </div>

      {/* Profile Summary Section */}
      <div className="glass rounded-[3rem] p-8 space-y-6 border-emerald-500/10 bg-emerald-500/5">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 p-1">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                 <User size={48} className="text-slate-600" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-[#010413]">
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-black">{state.user.name || 'Alex Thompson'}</h2>
            <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest">
              {state.user.age ? `${state.user.age} Years • ` : ''} 
              ID: #CA-8291
            </p>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl space-y-4 border-white/5">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <ClipboardList size={16} className="text-emerald-500" />
              Health Summary
           </div>
           <p className="text-sm text-slate-300 leading-relaxed font-medium">
             Monitoring {state.plantName || state.selectedPot.name}. 
             {state.user.medicalConditions ? ` Handling: ${state.user.medicalConditions}.` : ' No specific conditions listed.'}
             Adherence is 75% this week.
           </p>
        </div>
      </div>

      {/* Profile Switching Zone */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
           <Users size={16} /> Accounts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Current Active Account */}
           <button className="glass p-6 rounded-[2rem] border-emerald-500/50 flex items-center gap-4 bg-emerald-500/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-black">
                {state.user.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                 <div className="font-black text-sm">{state.user.name || 'User'}</div>
                 <div className="text-[10px] opacity-50 font-bold uppercase">Active Profile</div>
              </div>
              <div className="ml-auto w-3 h-3 bg-emerald-500 rounded-full" />
           </button>

           {/* Inactive Accounts */}
           {state.accounts.map((acc) => (
              <button 
                key={acc.username}
                onClick={() => onSwitchAccount(acc.username)}
                className="glass p-6 rounded-[2rem] border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center font-black">
                  {acc.name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                   <div className="font-black text-sm">{acc.name}</div>
                   <div className="text-[10px] opacity-50 font-bold uppercase">Switch Profile</div>
                </div>
              </button>
           ))}

           {/* Add New Account Button */}
           <button 
             onClick={() => setShowAddModal(true)}
             className="glass p-6 rounded-[2rem] border-dashed border-emerald-500/30 flex items-center gap-4 hover:bg-emerald-500/5 transition-all group"
           >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <div className="text-left">
                 <div className="font-black text-sm">Add Account</div>
                 <div className="text-[10px] opacity-50 font-bold uppercase">Create another</div>
              </div>
           </button>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">Support & Legal</h3>
        {sections.map((item, i) => (
          <button 
            key={i} 
            className="w-full glass rounded-[1.5rem] p-5 flex items-center justify-between hover:bg-white/5 transition-all group border-white/5"
          >
            <div className="flex items-center gap-4 text-slate-300">
              <div className="p-2 rounded-xl bg-slate-800 group-hover:text-emerald-400 transition-colors">
                {item.icon}
              </div>
              <span className="font-bold text-sm">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-600" />
          </button>
        ))}
      </div>

      {/* Logout Action */}
      <div className="pt-4">
        <button 
          onClick={onSignOut}
          className="w-full rounded-[1.5rem] p-5 flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20 hover:bg-rose-500/20 transition-all"
        >
          <LogOut size={18} />
          Sign Out of CARE4U
        </button>
      </div>

      <div className="text-center opacity-30 pb-12">
        <p className="text-[10px] font-bold">CARE4U MOBILE VERSION 2.5.1</p>
        <p className="text-[8px] mt-1">© 2024 CARE4U HEALTH SYSTEMS GLOBAL</p>
      </div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full rounded-[3.5rem] p-10 space-y-8 relative border-white/10"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
                <X size={28} />
              </button>
              
              <div className="text-center">
                <h2 className="text-3xl font-black">New Account</h2>
                <p className="text-slate-500 font-medium">Add a user to this device.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Jane Smith" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-emerald-500/10 font-bold"
                    value={newAccount.name}
                    onChange={e => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Username</label>
                  <input 
                    type="text" 
                    placeholder="jane_smith" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-emerald-500/10 font-bold"
                    value={newAccount.username}
                    onChange={e => setNewAccount(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-12 outline-none focus:ring-4 ring-emerald-500/10 font-bold"
                    />
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddAccount}
                className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 transition-all flex items-center justify-center gap-3"
              >
                CREATE PROFILE <UserPlus size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsView;
