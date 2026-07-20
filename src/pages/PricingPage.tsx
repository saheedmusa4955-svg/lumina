import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionHeader } from '@/components/SectionHeader';
import { PERSONAL_FEE_ROWS, BUSINESS_FEE_ROWS } from '@/lib/constants';
import { Check } from 'lucide-react';

const savings = [
  { label: 'No monthly fees', amount: '\u00a3120' },
  { label: 'No foreign spending fees', amount: '\u00a3340' },
  { label: 'Better exchange rates', amount: '\u00a3280' },
  { label: 'Free transfers', amount: '\u00a3107' },
];

const pricingFaqs = [
  { q: 'Are there really no monthly fees?', a: "Yes, really. Both personal and business accounts are free to open and maintain. We make money on currency conversion (0.5%) and optional express services, not account fees." },
  { q: "What's the catch with free transfers?", a: "No catch. UK Faster Payments and Euro SEPA transfers are genuinely free and unlimited. We only charge for SWIFT international transfers, and even those start from just \u00a31.50." },
  { q: 'How is the exchange rate calculated?', a: "We use the mid-market rate \u2014 the real rate you see on Google or Reuters. We add a small 0.5% fee on currency conversions, which is significantly less than the 3-5% most banks charge." },
  { q: 'Are there limits on free ATM withdrawals?', a: "Personal accounts get up to \u00a3200 of free foreign ATM withdrawals per month. Business accounts get up to \u00a3500. After that, a 2% fee applies." },
  { q: 'Do business account fees scale?', a: 'The first 3 team members are free. Additional seats are \u00a35 per user per month. All other features \u2014 cards, transfers, integrations \u2014 are included at no extra cost.' },
];

export default function PricingPage() {
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const feeRows = accountType === 'personal' ? PERSONAL_FEE_ROWS : BUSINESS_FEE_ROWS;

  return (
    <div className="pt-16">
      <section className="pt-24 lg:pt-32 pb-16 text-center" style={{ background: 'linear-gradient(180deg, #0A1428 0%, #0F172A 100%)' }}>
        <FadeIn><span className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]">Pricing</span></FadeIn>
        <FadeIn delay={0.1}><h1 className="text-3xl md:text-5xl font-normal text-white mt-4">No hidden fees. Ever.</h1></FadeIn>
        <FadeIn delay={0.2}><p className="text-base text-lumina-text-secondary mt-5 max-w-lg mx-auto">We believe in radical transparency. Here&apos;s exactly what you&apos;ll pay — and what you won&apos;t.</p></FadeIn>
      </section>

      {/* Account Type Toggle */}
      <div className="py-8 bg-lumina-bg">
        <FadeIn>
          <div className="flex justify-center">
            <div className="bg-lumina-surface-light rounded-full p-1 flex gap-1">
              {(['personal', 'business'] as const).map((type) => (
                <button key={type} onClick={() => setAccountType(type)} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${accountType === type ? 'bg-lumina-surface text-white shadow-sm' : 'text-lumina-text-tertiary hover:text-lumina-text-secondary'}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Fee Table */}
      <section className="py-8 bg-lumina-bg">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="bg-lumina-surface border border-lumina-border rounded-xl overflow-hidden">
              <div className="px-8 py-5 border-b border-lumina-border"><h3 className="text-lg font-medium text-white capitalize">{accountType} account fees</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead><tr className="bg-lumina-surface-light"><th className="text-left px-8 py-3 text-xs font-medium text-lumina-text-secondary uppercase">Service</th><th className="text-left px-6 py-3 text-xs font-medium text-lumina-accent uppercase">Lumina fee</th><th className="text-left px-8 py-3 text-xs font-medium text-lumina-text-secondary uppercase line-through">Traditional banks*</th></tr></thead>
                  <tbody>
                    <AnimatePresence mode="wait">
                      <motion.tr key={accountType} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <td colSpan={3} className="p-0">
                          {feeRows.map((row, i) => (
                            <div key={i} className="flex border-b border-lumina-border last:border-0 hover:bg-lumina-surface-light/30 transition-colors">
                              <div className="flex-1 px-8 py-3.5 text-sm font-medium text-white">{row.service}</div>
                              <div className="w-40 px-6 py-3.5 text-sm font-medium text-lumina-accent">{row.lumina}</div>
                              <div className="w-40 px-8 py-3.5 text-sm text-lumina-text-secondary line-through hidden md:block">{row.traditional}</div>
                            </div>
                          ))}
                        </td>
                      </motion.tr>
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-4 border-t border-lumina-border">
                <p className="text-xs text-lumina-text-tertiary italic">*Based on average fees from major UK high street banks as of January 2025. Fees subject to change.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <SectionHeader eyebrow="Compare" heading="See what you'll save" />
          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn direction="left">
              <div className="bg-lumina-surface border border-lumina-border rounded-xl p-10 border-t-[3px] border-t-lumina-accent">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-lumina-accent"><path d="M4 20L12 4L8 12H16L12 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 4L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  <span className="text-lg font-medium text-white">Lumina</span>
                </div>
                <p className="text-xs text-lumina-text-tertiary mb-6">Your annual savings</p>
                <p className="text-5xl font-light text-lumina-accent">\u00a3847</p>
                <p className="text-xs text-lumina-text-tertiary mt-2">Estimated annual savings vs. traditional banks</p>
                <div className="mt-8 space-y-3">
                  {savings.map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Check size={14} className="text-lumina-accent" /><span className="text-sm text-lumina-text-secondary">{s.label}</span></div>
                      <span className="text-sm font-medium text-lumina-accent">{s.amount} saved</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="mt-8 flex h-12 rounded-full items-center justify-center text-[15px] font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all hover:scale-[1.02]">Open free account</Link>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.1}>
              <div className="bg-lumina-surface border border-lumina-border rounded-xl p-10">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-lumina-text-tertiary"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2"/></svg>
                  <span className="text-lg font-medium text-lumina-text-secondary">Traditional banks</span>
                </div>
                <p className="text-xs text-lumina-text-tertiary mb-6">What you could pay</p>
                <p className="text-5xl font-light text-lumina-text-secondary line-through decoration-lumina-danger/40">\u00a3847+</p>
                <div className="mt-8 space-y-3">
                  {savings.map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-sm text-lumina-text-secondary">{s.label}</span>
                      <span className="text-sm text-lumina-text-secondary line-through">{s.amount}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-xs text-lumina-text-tertiary italic">*Based on average UK banking fees</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-lumina-bg border-t border-lumina-border">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="text-2xl font-normal text-white mb-8">Pricing FAQ</h3>
          <div className="space-y-2">
            {pricingFaqs.map((faq, i) => (
              <div key={i} className="border-b border-lumina-border">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left">
                  <span className="text-base font-medium text-white pr-4">{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="shrink-0 text-lumina-text-tertiary text-xl">+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="text-sm text-lumina-text-secondary leading-relaxed pb-5">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-lumina-surface border-t border-lumina-border">
        <FadeIn>
          <h2 className="text-3xl font-normal text-white">Start saving today</h2>
          <p className="text-base text-lumina-text-secondary mt-4">Open your account in minutes. No credit check required.</p>
          <Link to="/contact" className="inline-flex h-12 px-8 rounded-full items-center text-[15px] font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all hover:scale-[1.02] mt-8">Open free account</Link>
        </FadeIn>
      </section>
    </div>
  );
}
