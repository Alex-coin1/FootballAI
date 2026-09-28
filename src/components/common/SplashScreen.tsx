import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { t, settings } = useApp();
  const isAr = settings.language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050912] cursor-pointer select-none"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-radial-gradient opacity-70 pointer-events-none" />
      
      {/* Animated Hexagonal Pulse Ring */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3], rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute w-56 h-56 rounded-full border border-cyan-500/20"
        />
        <motion.div
          animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.4, 0.8, 0.4], rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-44 h-44 rounded-full border border-blue-500/30 border-dashed"
        />

        {/* Central Logo Container */}
        <motion.div 
          initial={{ scale: 0.6, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          className="relative z-10 w-28 h-28 rounded-3xl bg-gradient-to-br from-[#0c203b] to-[#060c18] p-1 border border-cyan-400/50 shadow-2xl shadow-cyan-500/20 flex items-center justify-center"
        >
          <img 
            src="/icon.svg" 
            alt="FootballAI Logo" 
            className="w-20 h-20 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" 
          />
        </motion.div>
      </div>

      {/* Brand Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 text-center z-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-[11px] font-tech tracking-widest text-cyan-400 uppercase mb-2">
          <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>{isAr ? 'البروتوكول التجريبي v1.0' : 'PILOT PROTOCOL v1.0'}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
          FOOTBALL<span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">AI</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400 tracking-wide font-sans flex items-center justify-center gap-1.5">
          <span>{t.slogan}</span>
          <Sparkles className="w-3 h-3 text-amber-400" />
        </p>
      </motion.div>

      {/* Loading bar */}
      <div className="mt-10 w-40 h-1 bg-slate-800/80 rounded-full overflow-hidden z-10">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        />
      </div>

      <p className="absolute bottom-8 text-[11px] text-slate-500 font-sans">
        {isAr ? 'المس للمتابعة • المنظومة الرياضية الذكية للهواتف' : 'Tap to continue • Mobile-First Football Ecosystem'}
      </p>
    </motion.div>
  );
};
