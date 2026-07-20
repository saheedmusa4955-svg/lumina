import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';
import { FAQ_ITEMS, FAQ_CATEGORIES } from '@/lib/constants';
import { Link } from 'react-router-dom';

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState('Getting started');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = activeCategory === 'All'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((f) => f.category === activeCategory);

  return (
    <section className="py-24 lg:py-32 bg-lumina-bg border-t border-lumina-border">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader
          eyebrow="FAQ"
          heading="Questions? We've got answers"
          description="Everything you need to know about Lumina. Can't find what you're looking for? Reach out to our team."
        />

        {/* Category Tabs */}
        <FadeIn>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-8">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-lumina-surface text-white shadow-md'
                    : 'text-lumina-text-tertiary hover:text-lumina-text-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Accordion */}
        <div className="space-y-2">
          <AnimatePresence mode="wait">
            {filtered.map((item, i) => (
              <motion.div
                key={`${activeCategory}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border-b border-lumina-border"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-base font-medium text-white pr-4 group-hover:text-lumina-accent transition-colors">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-lumina-text-tertiary"
                  >
                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-lumina-text-secondary leading-relaxed pb-5">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="text-center mt-12">
            <p className="text-sm text-lumina-text-secondary mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex h-12 px-6 rounded-full items-center justify-center text-[15px] font-medium border border-lumina-border text-white hover:border-lumina-border-hover hover:bg-white/5 transition-all duration-300"
            >
              Chat with us
            </Link>
            <p className="text-xs text-lumina-text-tertiary mt-3">Available 24/7 &bull; Average response: 2 min</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
