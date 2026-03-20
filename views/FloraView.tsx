
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { Pot, Message } from '../types';

type Emotion = 'happy' | 'sad' | 'love' | 'surprised' | 'neutral' | 'oops';

const emotionMap: Record<string, { emoji: string; mood: Emotion }> = {
  'happy': { emoji: '😊', mood: 'happy' },
  'joy': { emoji: '🥳', mood: 'happy' },
  'smile': { emoji: '🙂', mood: 'happy' },
  'sad': { emoji: '😔', mood: 'sad' },
  'cry': { emoji: '😭', mood: 'sad' },
  'droop': { emoji: '🥀', mood: 'sad' },
  'love': { emoji: '❤️', mood: 'love' },
  'heart': { emoji: '💖', mood: 'love' },
  'wow': { emoji: '😮', mood: 'surprised' },
  'oops': { emoji: '🤭', mood: 'oops' },
};

const FloraView: React.FC<{ theme: string; selectedPot: Pot | null; plantName: string; messages: Message[]; onUpdateMessages: (ms: Message[]) => void }> = ({ theme, selectedPot, plantName, messages, onUpdateMessages }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const detectEmotion = (text: string): { mood: Emotion; label: string } => {
    const lowercase = text.toLowerCase();
    
    // Exact bracket matching has highest priority
    if (lowercase.includes('[happy]')) return { mood: 'happy', label: 'joyful' };
    if (lowercase.includes('[sad]')) return { mood: 'sad', label: 'drooping' };
    if (lowercase.includes('[love]')) return { mood: 'love', label: 'nurturing' };
    if (lowercase.includes('[surprised]')) return { mood: 'surprised', label: 'blooming' };
    if (lowercase.includes('[oops]')) return { mood: 'oops', label: 'bashful' };
    
    // Default keyword scan fallback
    for (const [key, val] of Object.entries(emotionMap)) {
      if (lowercase.includes(key)) return { mood: val.mood, label: key };
    }
    return { mood: 'neutral', label: 'calm' };
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = input;
    setInput('');
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg, timestamp: now }];
    onUpdateMessages(newMessages);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are ${plantName || selectedPot?.name || 'Flora'}, the living spirit companion for this healthcare app. 
          You are deeply expressive and empathetic.
          RULES:
          1. Start EVERY response with one emotion tag: [happy], [sad], [love], [surprised], or [oops].
          2. Use your name "${plantName || selectedPot?.name}" occasionally in conversation.
          3. Keep responses warm, succinct (max 2 sentences), and slightly poetic.
          4. React authentically to the user's prompt. If they share a win, be [happy]. If they are struggling, be [love] or [sad].`,
        }
      });

      let fullText = '';
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      onUpdateMessages([...newMessages, { role: 'ai', content: '', isStreaming: true, timestamp: aiTimestamp }]);

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          onUpdateMessages([...newMessages, { role: 'ai', content: fullText, isStreaming: true, timestamp: aiTimestamp }]);
        }
      }

      const { mood, label } = detectEmotion(fullText);
      const cleanText = fullText.replace(/\[.*?\]/g, '').trim();
      
      onUpdateMessages([...newMessages, { role: 'ai', content: cleanText, isStreaming: false, emotion: mood, moodLabel: label, timestamp: aiTimestamp }]);
    } catch (err) {
      onUpdateMessages([...newMessages, { role: 'ai', content: "My energy is a bit low. Can we try again later? 😔", timestamp: now, emotion: 'sad', moodLabel: 'tangled' }]);
    } finally {
      setLoading(false);
    }
  };

  const startSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice typing is not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setInput(prev => prev + ' ' + event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-2xl mx-auto relative overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-12 pr-2 scrollbar-hide pb-28 pt-8">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col space-y-4">
              {msg.role === 'ai' && (
                <div className="flex flex-col items-center mb-4">
                  <span className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">{msg.moodLabel || plantName || selectedPot?.name}</span>
                  <span className="text-[10px] text-slate-600 font-bold">{msg.timestamp}</span>
                </div>
              )}
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-6 max-w-[95%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex-shrink-0 flex items-center justify-center relative transition-all duration-500 ${
                    msg.role === 'user' ? 'bg-indigo-600 shadow-2xl' : 'bg-[#0f172a] border-2 border-emerald-500/20 shadow-2xl'
                  }`}>
                    {msg.role === 'user' ? (
                      <User size={32} className="text-white" />
                    ) : (
                      <motion.div animate={{ scale: msg.isStreaming ? [1, 1.2, 1] : [1, 1.1, 1], y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="flex flex-col items-center">
                        <span className="text-5xl md:text-6xl filter drop-shadow-[0_10px_10px_rgba(16,185,129,0.3)]">
                          {msg.emotion && emotionMap[msg.emotion]?.emoji || selectedPot?.emoji}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className={`p-8 rounded-[3rem] text-lg md:text-xl leading-relaxed font-medium transition-all duration-500 ${
                    msg.role === 'user' ? 'bg-indigo-600 text-indigo-50 rounded-tr-none' : 'glass bg-[#0f172a]/80 text-slate-100 rounded-tl-none border-white/5 shadow-2xl'
                  }`}>
                    {msg.content}
                    {msg.isStreaming && <span className="inline-block w-2 h-6 ml-2 bg-emerald-400 animate-pulse" />}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-auto glass p-4 rounded-[3rem] border-white/5 flex items-center gap-4 relative z-10 shadow-2xl">
        <button onClick={startSpeech} className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/5 text-slate-400 hover:text-emerald-400'}`}>
          {isListening ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={`Talk to ${plantName || selectedPot?.name}...`} className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-xl font-bold placeholder:text-slate-600" />
        <button onClick={handleSend} disabled={loading || !input.trim()} className="w-16 h-16 rounded-[1.8rem] bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50">
          <Send size={28} />
        </button>
      </div>
    </div>
  );
};

export default FloraView;
