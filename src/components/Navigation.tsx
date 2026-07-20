import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Sun, Moon } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const isScrolled = useScrollPosition(50);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light');
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-nav h-16 transition-all duration-300',
          isScrolled
            ? 'bg-[#0A1428]/85 backdrop-blur-xl border-b border-lumina-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-content mx-auto h-full flex items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-lumina-accent">
              <path d="M4 20L12 4L8 12H16L12 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-lg font-semibold text-white tracking-tight">Lumina</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-[15px] transition-all duration-200',
                  location.pathname === link.href
                    ? 'text-lumina-accent bg-lumina-accent/15'
                    : 'text-lumina-text-secondary hover:text-white hover:bg-lumina-surface-light'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lumina-text-secondary hover:text-white hover:bg-lumina-surface-light transition-all duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <Link
              to="/contact"
              className="hidden sm:inline-flex h-10 px-5 rounded-full items-center gap-2 text-sm font-medium border border-lumina-border text-lumina-text-secondary hover:text-white hover:border-lumina-border-hover transition-all duration-300"
            >
              <Download size={16} />
              Download
            </Link>

            <Link
              to="/signup"
              className="hidden sm:inline-flex h-10 px-5 rounded-full items-center text-sm font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-all duration-300 hover:scale-[1.02]"
            >
              Sign Up
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-lumina-surface-light transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[49]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-16 right-0 bottom-0 w-[280px] bg-lumina-surface/95 backdrop-blur-xl border-l border-lumina-border z-[49] overflow-y-auto"
            >
              <div className="p-6 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-base transition-colors',
                        location.pathname === link.href
                          ? 'text-lumina-accent bg-lumina-accent/15'
                          : 'text-lumina-text-secondary hover:text-white hover:bg-lumina-surface-light'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-4 pt-4 border-t border-lumina-border flex flex-col gap-3">
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 rounded-full items-center justify-center gap-2 text-sm font-medium border border-lumina-border text-lumina-text-secondary hover:text-white transition-colors"
                  >
                    <Download size={16} />
                    Download App
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 rounded-full items-center justify-center text-sm font-semibold bg-lumina-accent text-lumina-bg hover:bg-lumina-accent-dark transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
