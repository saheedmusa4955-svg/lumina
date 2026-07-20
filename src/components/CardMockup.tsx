import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function CardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative w-[300px] h-[190px] md:w-[360px] md:h-[230px] cursor-pointer hidden md:block"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Back cards */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-lumina-surface-light to-lumina-border opacity-60" style={{ transform: 'rotate(-8deg) translate(-12px, -6px)' }} />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-lumina-border to-lumina-surface opacity-40" style={{ transform: 'rotate(5deg) translate(10px, 4px)' }} />

      {/* Main card */}
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(135deg, #0F172A 0%, #0d3b32 50%, #0A1428 100%)',
        }}
        initial={{ opacity: 0, y: 40, rotateY: -15 }}
        animate={{ opacity: 1, y: 0, rotateY: -5 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,229,192,0.3) 19px, rgba(0,229,192,0.3) 20px), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,229,192,0.3) 19px, rgba(0,229,192,0.3) 20px)',
        }} />
        <div className="relative p-5 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <div className="w-6 h-4 border border-yellow-300/50 rounded-sm" />
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/60">
              <path d="M2 12h4M18 12h4M6 8a4 4 0 010-4M18 8a4 4 0 000-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-white/80 text-sm tracking-[0.2em] font-mono">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4289</p>
            <div className="flex justify-between items-end mt-3">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Cardholder</p>
                <p className="text-xs text-white/80 font-medium uppercase tracking-wider">Alex Morgan</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Expires</p>
                <p className="text-xs text-white/80 font-medium">09/28</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-red-500/80" />
                <div className="w-6 h-6 rounded-full bg-yellow-500/80 -ml-3" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
