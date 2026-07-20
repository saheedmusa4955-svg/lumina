import { SectionHeader } from '@/components/SectionHeader';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { FadeIn } from '@/components/animations/FadeIn';
import { TESTIMONIALS } from '@/lib/constants';
import { motion } from 'framer-motion';

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-lumina-surface border-t border-lumina-border">
      <div className="max-w-content mx-auto px-6">
        <SectionHeader
          eyebrow="Loved by millions"
          heading="Don't just take our word for it"
          description="Join over 3 million people who trust Lumina with their money every day."
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={i} className={i === 0 ? 'md:row-span-2' : ''}>
              <motion.div
                whileHover={{ y: -2, borderColor: '#334155' }}
                transition={{ duration: 0.3 }}
                className={`h-full bg-lumina-surface border border-lumina-border rounded-xl p-6 hover:shadow-card-hover transition-all duration-300 ${i === 0 ? 'flex flex-col justify-center' : ''}`}
              >
                <p className={`text-lumina-text-secondary leading-relaxed ${i === 0 ? 'text-base' : 'text-sm'}`}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-5">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-9 h-9 rounded-full object-cover border border-lumina-border"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{t.author}</p>
                    <p className="text-xs text-lumina-text-tertiary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Ratings */}
        <FadeIn delay={0.6}>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
            {[
              { label: 'App Store', rating: '4.8' },
              { label: 'Google Play', rating: '4.7' },
              { label: 'Trustpilot', rating: '4.9' },
              { label: 'Users', rating: '3M+' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-lumina-text-secondary">
                <span className="text-yellow-400">&#9733;</span>
                <span className="font-medium text-white">{item.rating}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Press Logos */}
        <FadeIn delay={0.8}>
          <div className="mt-12 text-center">
            <p className="text-xs text-lumina-text-tertiary mb-4">Featured in</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {['TechCrunch', 'Forbes', 'Wired', 'FT', 'The Guardian'].map((pub) => (
                <span
                  key={pub}
                  className="text-sm font-semibold text-lumina-text-tertiary/40 hover:text-lumina-text-secondary transition-opacity duration-300 cursor-default"
                >
                  {pub}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
