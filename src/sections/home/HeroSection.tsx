import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CardMockup } from '@/components/CardMockup';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 pb-24"
      style={{ background: 'linear-gradient(135deg, #1a103c 0%, #0A1428 40%, #0d3b32 100%)' }}
    >
      {/* Radial glow */}
      <div className="absolute right-[15%] top-[25%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,229,192,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-content mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]"
            >
              The future of banking is here
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[56px] font-normal text-white leading-[1.1] mt-4 tracking-tight"
            >
              Your money, your way.{' '}
              <span className="text-gradient-shimmer">Banking without borders.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base text-lumina-text-secondary leading-relaxed mt-6 max-w-md"
            >
              Open an account in minutes. Hold 40+ currencies, transfer worldwide, and spend with a card that works everywhere — all from one beautiful app.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Link
                to="/signup"
                className="inline-flex h-12 px-6 rounded-full items-center justify-center text-[15px] font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all duration-300 hover:scale-[1.02]"
              >
                Open Account
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 px-6 rounded-full items-center justify-center text-[15px] font-medium border border-lumina-border text-white hover:border-lumina-border-hover hover:bg-white/5 transition-all duration-300"
              >
                Download App
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="flex items-center gap-6 mt-10 text-xs text-lumina-text-secondary"
            >
              <span>4.8<span className="text-yellow-400 ml-1">&#9733;</span> App Store</span>
              <span className="text-lumina-text-tertiary">&bull;</span>
              <span>4.7<span className="text-yellow-400 ml-1">&#9733;</span> Google Play</span>
              <span className="text-lumina-text-tertiary">&bull;</span>
              <span>3M+ users</span>
            </motion.div>
          </div>

          {/* Right: Card Mockup */}
          <div className="flex justify-center lg:justify-end">
            <CardMockup />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 rounded-full border-2 border-lumina-text-tertiary flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-lumina-text-tertiary"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
