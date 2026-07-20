import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/constants';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const featured = BLOG_POSTS[2]; // 3M users article

  return (
    <div className="pt-16">
      {/* Featured Article */}
      <section className="pt-24 lg:pt-32 pb-12 bg-lumina-surface border-b border-lumina-border">
        <div className="max-w-content mx-auto px-6">
          <FadeIn>
            <div className="bg-lumina-surface-light border border-lumina-border rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto">
                  <img src="/images/blog/featured-hero.jpg" alt={featured.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <span className="text-xs font-medium text-lumina-accent uppercase tracking-wider">{featured.category}</span>
                  <h2 className="text-2xl lg:text-3xl font-normal text-white mt-3 leading-tight">{featured.title}</h2>
                  <p className="text-sm text-lumina-text-secondary mt-4 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 mt-6">
                    <img src={featured.author.avatar} alt={featured.author.name} className="w-7 h-7 rounded-full object-cover" loading="lazy" />
                    <span className="text-xs text-white font-medium">{featured.author.name}</span>
                    <span className="text-xs text-lumina-text-tertiary">{featured.date}</span>
                    <span className="text-xs text-lumina-text-tertiary">{featured.readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-5 text-xs font-medium text-lumina-accent">Read article &rarr;</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-lumina-bg">
        <div className="max-w-content mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {BLOG_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-lumina-surface text-white shadow-sm' : 'text-lumina-text-tertiary hover:text-lumina-text-secondary'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-8 bg-lumina-bg">
        <div className="max-w-content mx-auto px-6">
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.filter((_, i) => i !== 2).map((post, i) => (
              <StaggerItem key={i}>
                <motion.article whileHover={{ y: -4, borderColor: '#334155' }} transition={{ duration: 0.3 }} className="bg-lumina-surface border border-lumina-border rounded-xl overflow-hidden hover:shadow-card-hover transition-all cursor-pointer h-full flex flex-col">
                  <div className="aspect-video">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] text-lumina-text-tertiary">{post.date}</span>
                      <span className="text-lumina-text-tertiary">&bull;</span>
                      <span className="text-[10px] text-lumina-accent">{post.category}</span>
                    </div>
                    <h3 className="text-base font-medium text-white leading-snug line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-lumina-text-secondary mt-2 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-lumina-bg">
        <div className="max-w-xl mx-auto px-6">
          <FadeIn>
            <div className="rounded-2xl p-10 text-center" style={{ background: 'linear-gradient(135deg, #00E5C0 0%, #00C4A0 100%)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto text-lumina-bg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/></svg>
              <h3 className="text-2xl font-normal text-lumina-bg mt-4">Get Lumina updates</h3>
              <p className="text-sm text-lumina-bg/70 mt-2">Financial tips, product updates, and exclusive offers. No spam, unsubscribe anytime.</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <input type="email" placeholder="Enter your email" className="flex-1 h-12 px-4 rounded-xl bg-white text-lumina-bg placeholder:text-lumina-bg/40 focus:outline-none focus:ring-2 focus:ring-lumina-bg/20 text-sm" />
                <button className="h-12 px-6 rounded-xl bg-lumina-bg text-white text-sm font-medium hover:bg-lumina-surface transition-colors">Subscribe</button>
              </div>
              <p className="text-xs text-lumina-bg/50 mt-3">Join 50,000+ subscribers</p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
