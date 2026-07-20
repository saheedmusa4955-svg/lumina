import { Check, X } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';
import { Link } from 'react-router-dom';
import { PERSONAL_FEE_ROWS } from '@/lib/constants';

const luminaFees = [
  { label: 'Monthly account fee', value: '\u00a30.00' },
  { label: 'Card delivery', value: 'Free' },
  { label: 'Foreign spending', value: '0%' },
  { label: 'Currency exchange', value: '0.5%' },
  { label: 'ATM withdrawals', value: 'Up to \u00a3200 free' },
  { label: 'Local transfers', value: 'Free' },
  { label: 'International transfers', value: 'From \u00a31.50' },
];

const traditionalFees = [
  { label: 'Monthly account fee', value: '\u00a36-15' },
  { label: 'Card delivery', value: '\u00a35-10' },
  { label: 'Foreign spending', value: '2.75-3%' },
  { label: 'Currency exchange', value: '3-5%' },
  { label: 'ATM withdrawals', value: '\u00a31.50-3' },
  { label: 'Local transfers', value: '\u00a30-25' },
  { label: 'International transfers', value: '\u00a315-40' },
];

export function PricingSection() {
  return (
    <section className="py-24 lg:py-32 bg-lumina-surface border-t border-lumina-border">
      <div className="max-w-content mx-auto px-6">
        <SectionHeader
          eyebrow="Transparent pricing"
          heading="See what you'll save"
          description="No hidden fees, no monthly charges, no surprises. Just fair, transparent pricing."
        />

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <FadeIn direction="left">
            <div className="bg-lumina-surface border border-lumina-border rounded-xl p-8 md:p-10 border-t-[3px] border-t-lumina-accent">
              <div className="flex items-center gap-3 mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-lumina-accent">
                  <path d="M4 20L12 4L8 12H16L12 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 4L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className="text-xl font-medium text-white">Lumina</span>
              </div>
              <p className="text-xs text-lumina-text-tertiary mb-8">Digital banking</p>
              <div className="space-y-4">
                {luminaFees.map((fee) => (
                  <div key={fee.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Check size={16} className="text-lumina-accent shrink-0" />
                      <span className="text-sm text-lumina-text-secondary">{fee.label}</span>
                    </div>
                    <span className="text-sm font-medium text-lumina-accent">{fee.value}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/signup"
                className="mt-8 flex h-12 rounded-full items-center justify-center text-[15px] font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all duration-300 hover:scale-[1.02]"
              >
                Open free account
              </Link>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <div className="bg-lumina-surface border border-lumina-border rounded-xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-lumina-text-tertiary">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-xl font-medium text-lumina-text-secondary">Traditional banks</span>
              </div>
              <p className="text-xs text-lumina-text-tertiary mb-8">High street banking</p>
              <div className="space-y-4">
                {traditionalFees.map((fee) => (
                  <div key={fee.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <X size={16} className="text-lumina-danger/60 shrink-0" />
                      <span className="text-sm text-lumina-text-secondary">{fee.label}</span>
                    </div>
                    <span className="text-sm font-medium text-lumina-text-secondary line-through decoration-lumina-danger/40">{fee.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs text-lumina-text-tertiary italic">
                *Based on average fees from major UK high street banks
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Fee Table */}
        <FadeIn>
          <div className="bg-lumina-surface border border-lumina-border rounded-xl overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b border-lumina-border">
              <h3 className="text-lg font-medium text-white">Complete fee schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-lumina-surface-light">
                    <th className="text-left px-6 md:px-8 py-3 text-xs font-medium text-lumina-text-secondary uppercase">Service</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-lumina-accent uppercase">Lumina</th>
                    <th className="text-left px-6 md:px-8 py-3 text-xs font-medium text-lumina-text-secondary uppercase line-through">Traditional avg</th>
                  </tr>
                </thead>
                <tbody>
                  {PERSONAL_FEE_ROWS.map((row, i) => (
                    <tr key={i} className="border-b border-lumina-border last:border-0 hover:bg-lumina-surface-light/30 transition-colors">
                      <td className="px-6 md:px-8 py-3.5 text-sm font-medium text-white">{row.service}</td>
                      <td className="px-6 py-3.5 text-sm font-medium text-lumina-accent">{row.lumina}</td>
                      <td className="px-6 md:px-8 py-3.5 text-sm text-lumina-text-secondary line-through">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
