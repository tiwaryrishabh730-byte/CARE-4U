
import React, { useState } from 'react';
import { Home as HomeIcon, Watch as WatchIcon, History as HistoryIcon, Sparkles, Bell, Sun, Moon, Leaf, LogIn, CalendarDays, ArrowRight, User, UserPlus } from 'lucide-react';
import { AppState, Vital, Medication, Pot, HistoryLog, Message, UserProfile } from './types';
import Home from './views/Home';
import WatchView from './views/Watch';
import HistoryView from './views/History';
import FloraView from './views/FloraView';
import Schedule from './views/Schedule';
import PotSelector from './views/PotSelector';
import SettingsView from './views/Settings';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

const COMPANIONS: Pot[] = [
  { id: 'lotus', name: 'Lotus', personality: 'Calm', mood: 'happy', emoji: '🪷', subtitle: 'CALM & NURTURING', description: 'Focuses on breathing and meditation.', color: '#ec4899', needs: { water: 85, sunlight: 90, spirit: 95 } },
  { id: 'sage', name: 'Sage', personality: 'Playful', mood: 'thriving', emoji: '🌿', subtitle: 'PLAYFUL & ENERGETIC', description: 'Encourages daily movement.', color: '#10b981', needs: { water: 70, sunlight: 60, spirit: 88 } },
  { id: 'ivy', name: 'Ivy', personality: 'Wise', mood: 'neutral', emoji: '🪴', subtitle: 'WISE & STEADY', description: 'Helps with med schedule consistency.', color: '#0ea5e9', needs: { water: 95, sunlight: 40, spirit: 75 } },
  { id: 'fern', name: 'Fern', personality: 'Curious', mood: 'happy', emoji: '🍃', subtitle: 'CURIOUS & FUN', description: 'Shares fun health facts.', color: '#8b5cf6', needs: { water: 60, sunlight: 80, spirit: 92 } },
];

const INITIAL_VITALS: Vital[] = [
  { id: '1', type: 'heart_rate', value: 72, unit: 'BPM', timestamp: new Date() },
  { id: '2', type: 'blood_oxygen', value: 98, unit: '%', timestamp: new Date() },
  { id: '3', type: 'blood_pressure', value: '118/79', unit: 'mmHg', timestamp: new Date() },
  { id: '4', type: 'stress', value: 12, unit: '%', timestamp: new Date() },
];

const INITIAL_HISTORY: HistoryLog[] = [
  { date: '2023-10-24', steps: 6420, medsCompleted: 4, avgHeartRate: 71 },
  { date: '2023-10-23', steps: 8100, medsCompleted: 3, avgHeartRate: 74 },
  { date: '2023-10-22', steps: 10200, medsCompleted: 4, avgHeartRate: 69 },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: { name: '', username: '', age: undefined, medicalConditions: '' },
    accounts: [],
    plantName: '',
    vitals: INITIAL_VITALS,
    medications: [
      { id: 'm1', name: 'Lisinopril', dosage: '10mg', time: '08:00 AM', timeSlot: 'Morning', taken: false, color: 'emerald', category: 'medicine' },
      { id: 'm2', name: 'Hydration', dosage: '500ml', time: '12:30 PM', timeSlot: 'Noon', taken: true, color: 'blue', category: 'water' },
      { id: 'm3', name: 'Daily Walk', dosage: '20 mins', time: '06:00 PM', timeSlot: 'Evening', taken: false, color: 'amber', category: 'walk' },
    ],
    history: INITIAL_HISTORY,
    selectedPot: COMPANIONS[1],
    chatMessages: [
      { role: 'ai', content: "Hello! I am your companion. Your energy feels wonderful today. How can I help you blossom? 😊", timestamp: "10:11 AM", emotion: 'happy', moodLabel: 'thriving' }
    ],
    currentView: 'home',
    theme: 'dark',
    onboardingStep: 'auth',
  });

  const [showSplash, setShowSplash] = useState(true);

  const toggleTheme = () => setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  const setView = (view: AppState['currentView']) => setState(prev => ({ ...prev, currentView: view }));
  
  const updateMessages = (newMessages: Message[]) => {
    setState(prev => ({ ...prev, chatMessages: newMessages }));
  };

  const selectCompanion = (pot: Pot) => {
    setState(prev => ({ ...prev, selectedPot: pot }));
  };

  const completeStep = (next: AppState['onboardingStep']) => {
    setState(prev => {
      const newState = { ...prev, onboardingStep: next };
      if (next === 'main') {
        newState.chatMessages = [
          { 
            role: 'ai', 
            content: `Hello ${prev.user.name}! I am ${prev.plantName || prev.selectedPot.name}. I'm feeling very connected to your energy today! How can I help you blossom? 😊`, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            emotion: 'happy', 
            moodLabel: 'thriving' 
          }
        ];
      }
      return newState;
    });
  };

  const handleAddMedication = (med: Medication) => {
    setState(prev => ({ ...prev, medications: [...prev.medications, med] }));
  };

  const handleToggleMedication = (id: string) => {
    setState(prev => ({
      ...prev,
      medications: prev.medications.map(m => m.id === id ? { ...m, taken: !m.taken } : m)
    }));
  };

  const addAccount = (account: UserProfile) => {
    setState(prev => ({ ...prev, accounts: [...prev.accounts, account] }));
  };

  const switchAccount = (username: string) => {
    const selected = state.accounts.find(a => a.username === username);
    if (selected) {
      setState(prev => ({
        ...prev,
        user: selected,
        accounts: [prev.user, ...prev.accounts.filter(a => a.username !== username)],
        chatMessages: [
          { role: 'ai', content: `Hello ${selected.name}! I am your companion. Your energy feels wonderful today. How can I help you blossom? 😊`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), emotion: 'happy', moodLabel: 'thriving' }
        ]
      }));
    }
  };

  const handleSignOut = () => {
    setShowSplash(true);
    setState(prev => ({
      ...prev,
      user: { name: '', username: '', age: undefined, medicalConditions: '' },
      plantName: '',
      chatMessages: [
        { role: 'ai', content: "Hello! I am your companion. Your energy feels wonderful today. How can I help you blossom? 😊", timestamp: "10:11 AM", emotion: 'happy', moodLabel: 'thriving' }
      ],
      onboardingStep: 'auth',
      currentView: 'home'
    }));
  };

  if (showSplash) {
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-700 ${state.theme === 'dark' ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/40"
          >
            <Sparkles size={48} className="text-white" />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter">CARE<span className="text-emerald-500">4U</span></h1>
          <p className="text-emerald-500 font-bold tracking-widest text-xs uppercase">Nurturing You</p>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSplash(false)}
            className="px-12 py-4 rounded-2xl bg-emerald-500 text-white font-black shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 transition-all"
          >
            GET STARTED
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (state.onboardingStep !== 'main') {
    return (
      <div className={`min-h-[100dvh] transition-colors duration-500 flex flex-col items-center justify-center p-6 ${state.theme === 'dark' ? 'bg-[#010413] text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
        <AnimatePresence mode="wait">
          {state.onboardingStep === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-md space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-100">Welcome Back</h1>
                <p className="text-slate-500 font-medium">Connect to your care circle.</p>
              </div>
              <div className="glass p-8 rounded-[2.5rem] space-y-4 shadow-2xl">
                <div className="text-left space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Username</label>
                    <input type="text" placeholder="alex_health" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-emerald-500/20 transition-all" />
                </div>
                <div className="text-left space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-emerald-500/20 transition-all" />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => completeStep('profile')} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                    LOGIN <LogIn size={20} />
                </motion.button>
                <div className="pt-4 text-xs font-bold text-slate-500">
                    New to CARE4U? <span className="text-emerald-500 cursor-pointer hover:underline" onClick={() => completeStep('register')}>Register Now</span>
                </div>
              </div>
            </motion.div>
          )}

          {state.onboardingStep === 'register' && (
            <motion.div key="register" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-md space-y-8 text-center h-[90vh] overflow-y-auto scrollbar-hide pr-2 py-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-100">Join CARE4U</h1>
                <p className="text-slate-500 font-medium">Start your personalized health journey.</p>
              </div>
              <div className="glass p-8 rounded-[2.5rem] space-y-4 shadow-2xl">
                <div className="text-left space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
                    <input type="text" value={state.user.name} onChange={(e) => setState(s => ({...s, user: {...s.user, name: e.target.value}}))} placeholder="Alex Thompson" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-emerald-500/20 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Username</label>
                      <input type="text" value={state.user.username} onChange={(e) => setState(s => ({...s, user: {...s.user, username: e.target.value}}))} placeholder="alex_h" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-emerald-500/20 transition-all" />
                  </div>
                  <div className="text-left space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Age</label>
                      <input type="number" value={state.user.age || ''} onChange={(e) => setState(s => ({...s, user: {...s.user, age: parseInt(e.target.value)}}))} placeholder="24" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-emerald-500/20 transition-all" />
                  </div>
                </div>
                <div className="text-left space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-emerald-500/20 transition-all" />
                </div>
                <div className="text-left space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Medical Conditions</label>
                    <textarea value={state.user.medicalConditions} onChange={(e) => setState(s => ({...s, user: {...s.user, medicalConditions: e.target.value}}))} placeholder="E.g. Hypertension, Diabetes..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-emerald-500/20 h-24 resize-none transition-all" />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => completeStep('companion')} disabled={!state.user.name || !state.user.username} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    CREATE ACCOUNT <ArrowRight size={20} />
                </motion.button>
                <div className="pt-2 text-xs font-bold text-slate-500">
                    Already have an account? <span className="text-emerald-500 cursor-pointer hover:underline" onClick={() => completeStep('auth')}>Login</span>
                </div>
              </div>
            </motion.div>
          )}

          {state.onboardingStep === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-md space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-black">What's your name?</h1>
                <p className="text-slate-500 font-medium">Let us personalize your care journey.</p>
              </div>
              <div className="glass p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
                 <input 
                    type="text" 
                    value={state.user.name}
                    onChange={(e) => setState(s => ({...s, user: {...s.user, name: e.target.value}}))}
                    placeholder="Enter your name..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-2xl font-black text-center outline-none focus:ring-2 ring-emerald-500/20 transition-all" 
                 />
                 <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!state.user.name.trim()}
                    onClick={() => completeStep('companion')} 
                    className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    CONTINUE <ArrowRight size={20} />
                 </motion.button>
              </div>
            </motion.div>
          )}

          {state.onboardingStep === 'companion' && (
            <motion.div key="companion" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl h-full overflow-y-auto scrollbar-hide py-8">
               <PotSelector companions={COMPANIONS} selectedPot={state.selectedPot} onSelect={selectCompanion} />
               <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#010413] to-transparent">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => completeStep('plantName')} className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-black shadow-2xl shadow-emerald-500/40"
                  >
                      I CHOOSE THIS COMPANION
                  </motion.button>
               </div>
            </motion.div>
          )}

          {state.onboardingStep === 'plantName' && (
            <motion.div key="plantName" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-md space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-black">Name your Plant</h1>
                <p className="text-slate-500 font-medium">Give your {state.selectedPot.name} a special name.</p>
              </div>
              <div className="glass p-8 rounded-[2.5rem] space-y-6 text-center shadow-2xl">
                 <motion.div 
                   animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="text-[120px] mb-4"
                 >
                   {state.selectedPot.emoji}
                 </motion.div>
                 <input 
                    type="text" 
                    value={state.plantName}
                    onChange={(e) => setState(s => ({...s, plantName: e.target.value}))}
                    placeholder="E.g. Sprout, Leafy..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-2xl font-black text-center outline-none focus:ring-2 ring-emerald-500/20 transition-all" 
                 />
                 <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!state.plantName.trim()}
                    onClick={() => completeStep('main')} 
                    className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    ENTER CARE CENTER <ArrowRight size={20} />
                 </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`h-[100dvh] transition-colors duration-500 flex flex-col overflow-hidden ${state.theme === 'dark' ? 'bg-[#010413] text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      
      <header className="h-20 flex items-center justify-between px-6 md:px-12 z-50 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter">CARE<span className="text-emerald-500">4U</span></h1>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Nurturing You</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setView('settings')}
            className={`w-12 h-12 glass rounded-full flex items-center justify-center transition-all ${state.currentView === 'settings' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'text-slate-400 hover:text-slate-300'}`}
          >
            <User size={20} />
          </motion.button>
          
          <div className="flex items-center gap-2 glass p-1 rounded-2xl shadow-lg">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setView('selector')}
              className={`p-3 rounded-xl transition-all ${state.currentView === 'selector' ? 'bg-emerald-500/20 text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Leaf size={20} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 rounded-xl text-slate-500 hover:text-amber-500 transition-all"
            >
              {state.theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main content with overflow handler */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden scrollbar-hide pb-48">
        <AnimatePresence mode="wait">
          <motion.div 
            key={state.currentView} 
            initial={{ opacity: 0, x: 15 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -15 }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full min-h-full"
          >
            {state.currentView === 'home' && <Home state={state} onAction={() => setView('ai')} onNavigate={setView} />}
            {state.currentView === 'watch' && <WatchView vitals={state.vitals} theme={state.theme} />}
            {state.currentView === 'history' && <HistoryView state={state} />}
            {state.currentView === 'ai' && <FloraView theme={state.theme} selectedPot={state.selectedPot} plantName={state.plantName} messages={state.chatMessages} onUpdateMessages={updateMessages} />}
            {state.currentView === 'schedule' && <Schedule medications={state.medications} onToggle={handleToggleMedication} onAdd={handleAddMedication} />}
            {state.currentView === 'selector' && <PotSelector companions={COMPANIONS} selectedPot={state.selectedPot} onSelect={selectCompanion} />}
            {state.currentView === 'settings' && <SettingsView state={state} onNavigate={setView} onAddAccount={addAccount} onSwitchAccount={switchAccount} onSignOut={handleSignOut} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FIXED NAVIGATION BAR */}
      <nav className={`fixed bottom-0 left-0 right-0 h-24 glass border-t z-[100] flex items-center justify-around px-4 pb-6 md:pb-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${state.theme === 'dark' ? 'border-white/5 bg-[#010413]/80' : 'border-slate-200 bg-white/80'}`}>
        <LayoutGroup>
          <NavItem icon={<HomeIcon size={20} />} active={state.currentView === 'home'} onClick={() => setView('home')} label="HOME" />
          <NavItem icon={<HistoryIcon size={20} />} active={state.currentView === 'history'} onClick={() => setView('history')} label="LOG" />
          
          <NavItem icon={<Leaf size={26} />} active={state.currentView === 'ai'} onClick={() => setView('ai')} label="FLORA" isSpecial />
          
          <NavItem icon={<WatchIcon size={20} />} active={state.currentView === 'watch'} onClick={() => setView('watch')} label="WATCH" />
          <NavItem icon={<CalendarDays size={20} />} active={state.currentView === 'schedule'} onClick={() => setView('schedule')} label="SCHEDULE" />
        </LayoutGroup>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void; label: string; isSpecial?: boolean }> = ({ icon, active, onClick, label, isSpecial }) => (
  <button 
    onClick={onClick} 
    className={`relative flex flex-col items-center gap-1.5 transition-all duration-500 outline-none ${active ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'} ${isSpecial ? 'mb-6' : ''}`}
  >
    <motion.div 
      whileTap={{ scale: 0.8, rotate: isSpecial ? 15 : 0 }}
      whileHover={{ scale: 1.1 }}
      className={`p-2.5 rounded-2xl transition-all duration-300 ${active && !isSpecial ? 'bg-emerald-500/15' : ''} ${isSpecial ? 'bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] -mt-4 p-5 animate-bounce-slow' : ''}`}
    >
      {icon}
    </motion.div>
    {!isSpecial && (
      <span className="text-[10px] font-black tracking-widest leading-none mt-1">{label}</span>
    )}
    {active && !isSpecial && (
      <motion.div 
        layoutId="nav-indicator"
        className="absolute -bottom-3 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
    )}
    {isSpecial && (
       <motion.div 
         animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }} 
         transition={{ repeat: Infinity, duration: 2 }}
         className="absolute -bottom-2 w-1.5 h-1.5 bg-emerald-500 rounded-full blur-[2px]" 
       />
    )}
  </button>
);

export default App;
