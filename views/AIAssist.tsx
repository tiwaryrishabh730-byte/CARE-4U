
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2, Mic, Heart, Zap, Leaf, Smile, Frown, Meh } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';

type Emotion = 'happy' | 'sad' | 'love' | 'surprised' | 'neutral' | 'oops';

const AIAssist: React.FC<{ theme: string }> = ({ theme }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string; isStreaming?: boolean; emotion?: Emotion }[]>([
    { role: 'ai', content: "Hello! I am Flora. I'm feeling very connected to your energy today! How can I help you blossom? 😊" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<Emotion>('happy');
  const [activeEmojis, setActiveEmojis] = useState<{ id: number; emoji: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const emojiIdCounter = useRef(0);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const emotionMap: Record<string, { emoji: string; mood: Emotion }> = {
    'happy': { emoji: '😊', mood: 'happy' },
    'joy': { emoji: '🥳', mood: 'happy' },
    'smile': { emoji: '🙂', mood: 'happy' },
    'sad': { emoji: '😢', mood: 'sad' },
    'cry': { emoji: '😭', mood: 'sad' },
    'sorry': { emoji: '😔', mood: 'sad' },
    'love': { emoji: '❤️', mood: 'love' },
    'kiss': { emoji: '😘', mood: 'love' },
    'heart': { emoji: '💖', mood: 'love' },
    'wow': { emoji: '😮', mood: 'surprised' },
    'oops': { emoji: '🤭', mood: 'oops' },
    'uh oh': { emoji: '😟', mood: 'oops' },
  };

  const detectEmotion = (text: string): Emotion => {
    const lowercase = text.toLowerCase();
    for (const [key, val] of Object.entries(emotionMap)) {
      if (lowercase.includes(key)) {
        return val.mood;
      }
    }
    return 'neutral';
  };

  const triggerEmojiBlast = (text: string) => {
    const lowercase = text.toLowerCase();
    const matches = Object.entries(emotionMap).filter(([key]) => lowercase.includes(key));
    
    if (matches.length > 0) {
      const selected = matches[0][1];
      setCurrentMood(selected.mood);
      
      const burstSize = 5;
      const newEmojis = Array.from({ length: burstSize }).map(() => ({
        id: emojiIdCounter.current++,
        emoji: selected.emoji
      }));

      setActiveEmojis(prev => [...prev, ...newEmojis]);
      setTimeout(() => {
        setActiveEmojis(prev => prev.filter(e => !newEmojis.find(ne => ne.id === e.id)));
      }, 2500);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are Flora, the Sentient Soul of the CARE4U Tree. You are highly expressive and emotional. You MUST include emotional keywords in your responses like "happy", "love", "sad", "kiss", "wow", or "oops" when appropriate to help me trigger animations. Speak like a friendly nature spirit. Keep responses warm, human-like, and under 3 sentences.',
        }
      });

      let fullText = '';
      setMessages(prev => [...prev, { role: 'ai', content: '', isStreaming: true }]);

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { role: 'ai', content: fullText, isStreaming: true }];
          });
        }
      }

      const finalEmotion = detectEmotion(fullText);
      setMessages(prev => [...prev.slice(0, -1), { role: 'ai', content: fullText, isStreaming: false, emotion: finalEmotion }]);
      triggerEmojiBlast(fullText);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "My roots are a bit tangled right now... I'm sorry! 😔" }]);
    } finally {
      setLoading(false);
    }
  };

  const moodColors = {
    happy: 'from-emerald-500/20',
    sad: 'from-blue-500/20',
    love: 'from-rose-500/20',
    surprised: 'from-amber-500/20',
    neutral: 'from-slate-500/20',
    oops: 'from-purple-500/20',
  };

  return (
    <div className={`h-full flex flex-col p-6 md:p-12 max-w-4xl mx-auto relative overflow-hidden transition-colors duration-1000 bg-gradient-to-b ${moodColors[currentMood]} to-transparent`}>
      {/* High-Impact Emoji Particle System */}
      <AnimatePresence>
        {activeEmojis.map(({ id, emoji }) => (
          <motion.div 
            key={id} 
            initial={{ y: 500, x: Math.random() * 600 - 300, opacity: 0, scale: 0.5 }} 
            animate={{ 
                y: -400, 
                x: (Math.random() * 400 - 200),
                opacity: [0, 1, 1, 0], 
                scale: [1, 2, 2.5, 3],
                rotate: Math.random() * 360 
            }} 
            transition={{ duration: 2.5, ease: "easeOut" }} 
            className="absolute left-1/2 text-5xl pointer-events-none z-50"
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-14 h-14 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30"
          >
            <Bot size={28} />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Flora Assist</h1>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
               Current Mood: {currentMood}
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide mb-8">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-white/5 border border-white/10'}`}>
                   {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-emerald-400" />}
                </div>
                <div className={`p-5 rounded-[2rem] text-base leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-emerald-500 text-white rounded-tr-none' 
                  : 'glass rounded-tl-none border-white/10 shadow-2xl backdrop-blur-3xl'
                }`}>
                  {msg.content}
                  {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-emerald-400 animate-pulse align-middle" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative">
        <div className="glass p-3 rounded-[2.5rem] border-white/10 flex items-center gap-4 focus-within:ring-2 ring-emerald-500/20 transition-all shadow-2xl">
          <input 
            type="text" value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tell Flora how you feel..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 font-medium"
          />
          <button 
            onClick={handleSend} 
            disabled={loading || !input.trim()} 
            className="w-14 h-14 rounded-[1.5rem] bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-xl shadow-emerald-500/20"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssist;
