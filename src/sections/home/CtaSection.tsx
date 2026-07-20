import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';

export function CtaSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d3b32 0%, #0A1428 50%, #1a103c 100%)' }}
    >
      {/* Radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center bottom, rgba(0,229,192,0.08) 0%, transparent 70%)' }}
      />

      {/* Floating card decoration */}
      <motion.div
        className="absolute right-[8%] top-[15%] w-[160px] h-[100px] rounded-lg opacity-[0.08] hidden lg:block"
        style={{
          background: 'linear-gradient(135deg, #0F172A, #0d3b32)',
          transform: 'rotate(15deg)',
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-normal text-white leading-tight">
            Ready to bank without borders?
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-base text-lumina-text-secondary mt-5 leading-relaxed max-w-md mx-auto">
            Join 3 million people who trust Lumina. Open your account in minutes and start banking globally.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            {/* QR Code placeholder */}
            <div className="bg-white rounded-xl p-2.5 border border-lumina-border">
              <div className="w-[100px] h-[100px] bg-lumina-surface rounded-lg flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 80 80" className="text-lumina-bg">
                  <rect width="80" height="80" fill="white"/>
                  <rect x="8" y="8" width="20" height="20" fill="currentColor"/>
                  <rect x="12" y="12" width="12" height="12" fill="white"/>
                  <rect x="14" y="14" width="8" height="8" fill="currentColor"/>
                  <rect x="52" y="8" width="20" height="20" fill="currentColor"/>
                  <rect x="56" y="12" width="12" height="12" fill="white"/>
                  <rect x="58" y="14" width="8" height="8" fill="currentColor"/>
                  <rect x="8" y="52" width="20" height="20" fill="currentColor"/>
                  <rect x="12" y="56" width="12" height="12" fill="white"/>
                  <rect x="14" y="58" width="8" height="8" fill="currentColor"/>
                  <rect x="36" y="8" width="4" height="4" fill="currentColor"/>
                  <rect x="44" y="8" width="4" height="4" fill="currentColor"/>
                  <rect x="36" y="16" width="4" height="4" fill="currentColor"/>
                  <rect x="40" y="12" width="4" height="4" fill="currentColor"/>
                  <rect x="8" y="36" width="4" height="4" fill="currentColor"/>
                  <rect x="16" y="36" width="4" height="4" fill="currentColor"/>
                  <rect x="8" y="44" width="4" height="4" fill="currentColor"/>
                  <rect x="20" y="40" width="4" height="4" fill="currentColor"/>
                  <rect x="36" y="36" width="8" height="8" fill="currentColor"/>
                  <rect x="52" y="36" width="4" height="4" fill="currentColor"/>
                  <rect x="60" y="36" width="4" height="4" fill="currentColor"/>
                  <rect x="56" y="44" width="4" height="4" fill="currentColor"/>
                  <rect x="64" y="40" width="4" height="4" fill="currentColor"/>
                  <rect x="36" y="52" width="4" height="4" fill="currentColor"/>
                  <rect x="44" y="56" width="4" height="4" fill="currentColor"/>
                  <rect x="40" y="60" width="4" height="4" fill="currentColor"/>
                  <rect x="52" y="56" width="8" height="4" fill="currentColor"/>
                  <rect x="56" y="60" width="4" height="8" fill="currentColor"/>
                  <rect x="64" y="52" width="8" height="4" fill="currentColor"/>
                  <rect x="64" y="60" width="4" height="4" fill="currentColor"/>
                  <rect x="72" y="64" width="4" height="4" fill="currentColor"/>
                  <rect x="68" y="68" width="8" height="4" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-[10px] text-lumina-text-tertiary mt-1.5">Scan to download</p>
            </div>

            {/* App Store Badges */}
            <div className="flex flex-col gap-3">
              <div className="h-10 px-4 bg-black/80 rounded-lg flex items-center gap-2 text-white text-xs border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <span>App Store</span>
              </div>
              <div className="h-10 px-4 bg-black/80 rounded-lg flex items-center gap-2 text-white text-xs border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.71.73-1.17 1.34-.83l15 8.5c.6.34.6 1.18 0 1.52l-15 8.5c-.61.34-1.34-.12-1.34-.83z"/></svg>
                <span>Google Play</span>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <p className="text-xs text-lumina-text-tertiary mt-8">
            Free to open &bull; No monthly fees &bull; FCA regulated
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
