import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionHeader } from '@/components/SectionHeader';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { CASE_STUDIES } from '@/lib/constants';

const tabs = ['Overview', 'Team', 'Expenses', 'Payments', 'Integrations'];

const tabContent: Record<string, { title: string; desc: string; features: string[]; image?: string }[]> = {
  Overview: [
    { title: 'See everything at a glance', desc: 'A real-time dashboard showing all company accounts, team spending, and upcoming payments.', features: ['Real-time balances', 'Spending by category', 'Team activity feed', 'Cash flow insights'], image: '/images/pages/business-dashboard.jpg' },
    { title: 'Operate globally', desc: 'Hold 40+ currencies, get local account details in GBP, EUR, USD, and AUD. Pay suppliers and receive payments like a local.', features: ['Multi-currency accounts', 'Local bank details', 'Competitive FX rates', 'Global payments'] },
  ],
  Team: [
    { title: 'Add your whole team', desc: 'Invite team members, set roles and permissions, and issue individual expense cards.', features: ['Up to 50 team members', 'Role-based permissions', 'Individual card limits', 'Spending policies'], image: '/images/pages/business-team.jpg' },
    { title: 'Control spending', desc: 'Set up approval flows for large purchases. Get notified when team members need approval.', features: ['Custom approval thresholds', 'Multi-level approvals', 'Real-time notifications', 'Policy enforcement'] },
  ],
  Expenses: [
    { title: 'Smart expense cards for everyone', desc: 'Issue physical and virtual cards to team members. Set limits, track spending, and export reports.', features: ['Physical & virtual cards', 'Custom spending limits', 'Merchant restrictions', 'Instant freeze'] },
    { title: 'Never lose a receipt', desc: 'Snap photos of receipts in the app. They\'re automatically matched to transactions and stored for 7 years.', features: ['Photo capture', 'Auto-matching', '7-year storage', 'Export reports'] },
  ],
  Payments: [
    { title: 'Pay everyone at once', desc: 'Upload a CSV and pay up to 1,000 people in one go. Perfect for payroll and supplier payments.', features: ['CSV upload', 'Up to 1,000 recipients', 'Scheduled payments', 'Payment templates'] },
    { title: 'Secure payment workflows', desc: 'Require dual approval for large payments. Set thresholds and approvers for your team.', features: ['Dual approval', 'Custom thresholds', 'Audit trail', 'Bulk scheduling'] },
  ],
  Integrations: [
    { title: 'Sync with your accounting software', desc: 'Connect QuickBooks, Xero, Sage, or FreeAgent. Transactions sync automatically, receipts attached.', features: ['QuickBooks', 'Xero', 'Sage', 'FreeAgent', 'CSV export'], image: '/images/pages/business-integrations.jpg' },
    { title: 'Build on Lumina', desc: 'Developer-friendly API for custom integrations. Webhooks, sandbox environment, comprehensive docs.', features: ['REST API', 'Webhooks', 'Sandbox', 'Full documentation'] },
  ],
};

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="pt-16">
      <section className="pt-24 lg:pt-32 pb-16 text-center" style={{ background: 'linear-gradient(180deg, #0A1428 0%, #0F172A 100%)' }}>
        <FadeIn><span className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]">Business Banking</span></FadeIn>
        <FadeIn delay={0.1}><h1 className="text-3xl md:text-5xl font-normal text-white mt-4">Banking built for business</h1></FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-base text-lumina-text-secondary mt-5 max-w-xl mx-auto">
            Multi-user accounts, team expense cards, accounting integrations, and VAT tools — everything your business needs.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/contact" className="inline-flex h-12 px-6 rounded-full items-center justify-center text-[15px] font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all hover:scale-[1.02]">Open business account</Link>
            <Link to="/contact" className="inline-flex h-12 px-6 rounded-full items-center justify-center text-[15px] font-medium border border-lumina-border text-white hover:border-lumina-border-hover transition-all">Talk to sales</Link>
          </div>
        </FadeIn>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-lumina-surface/95 backdrop-blur-xl border-b border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab ? 'bg-lumina-surface text-white shadow-sm' : 'text-lumina-text-tertiary hover:text-lumina-text-secondary'}`}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-16 bg-lumina-bg">
        <div className="max-w-content mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
              {tabContent[activeTab].map((f, i) => (
                <div key={i} className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className={i % 2 === 1 && f.image ? 'lg:order-2' : ''}>
                    <h3 className="text-2xl font-normal text-white mb-4">{f.title}</h3>
                    <p className="text-base text-lumina-text-secondary leading-relaxed mb-6">{f.desc}</p>
                    <ul className="space-y-3">
                      {f.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5 text-sm text-lumina-text-secondary">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-lumina-accent shrink-0"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {f.image && (
                    <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="rounded-xl overflow-hidden border border-lumina-border"><img src={f.image} alt={f.title} className="w-full h-64 md:h-80 object-cover" loading="lazy" /></div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 bg-lumina-surface border-t border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <SectionHeader eyebrow="Case studies" heading="Trusted by growing businesses" />
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="bg-lumina-surface border border-lumina-border rounded-xl overflow-hidden hover:shadow-card-hover transition-all h-full">
                  <div className="h-16 bg-lumina-surface-light flex items-center justify-center text-lg font-semibold text-white">{cs.company}</div>
                  <div className="p-8">
                    <p className="text-sm text-lumina-text-secondary italic leading-relaxed">&ldquo;{cs.quote}&rdquo;</p>
                    <p className="text-sm font-medium text-white mt-4">{cs.author}</p>
                    <p className="text-xs text-lumina-text-tertiary">{cs.role}</p>
                    <p className="text-2xl font-light text-lumina-accent mt-5">{cs.metric}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 bg-lumina-bg border-t border-lumina-border">
        <div className="max-w-2xl mx-auto px-6">
          <FadeIn>
            <div className="bg-lumina-surface border border-lumina-border rounded-2xl p-10 text-center">
              <h3 className="text-2xl font-normal text-white">Simple, transparent pricing</h3>
              <p className="text-sm text-lumina-text-secondary mt-3">No monthly fees. No hidden charges. Just fair pricing that scales with your business.</p>
              <div className="flex flex-wrap justify-center gap-8 mt-8">
                {[{ v: '\u00a30', l: 'Monthly fee' }, { v: '\u00a30', l: 'UK transfers' }, { v: '0.5%', l: 'Currency conversion' }, { v: 'From \u00a31.50', l: 'International' }].map((p) => (
                  <div key={p.l} className="text-center">
                    <p className="text-2xl font-light text-lumina-accent">{p.v}</p>
                    <p className="text-xs text-lumina-text-tertiary mt-1">{p.l}</p>
                  </div>
                ))}
              </div>
              <Link to="/pricing" className="inline-flex h-12 px-8 rounded-full items-center text-[15px] font-medium border border-lumina-border text-white hover:border-lumina-border-hover transition-all mt-8">See full pricing &rarr;</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center" style={{ background: 'linear-gradient(135deg, #00E5C0 0%, #00C4A0 100%)' }}>
        <FadeIn>
          <h2 className="text-3xl font-normal text-lumina-bg">Ready to streamline your business finances?</h2>
          <p className="text-base text-lumina-bg/70 mt-4 max-w-md mx-auto">Open a business account in minutes. No credit check, no monthly fees.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/contact" className="inline-flex h-12 px-8 rounded-full items-center text-[15px] font-semibold bg-lumina-bg text-white hover:bg-lumina-surface transition-all hover:scale-[1.02]">Open business account</Link>
            <Link to="/contact" className="inline-flex h-12 px-8 rounded-full items-center text-[15px] font-medium border-2 border-lumina-bg text-lumina-bg hover:bg-lumina-bg hover:text-white transition-all">Talk to sales</Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
