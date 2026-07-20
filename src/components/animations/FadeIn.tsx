import { motion } from 'framer-motion';
import { viewportConfig } from '@/lib/animations';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  y?: number;
  x?: number;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = '',
  y,
  x,
}: FadeInProps) {
  const offsetY = y !== undefined ? y : direction === 'up' ? 30 : direction === 'down' ? -30 : 0;
  const offsetX = x !== undefined ? x : direction === 'left' ? 30 : direction === 'right' ? -30 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: offsetY, x: offsetX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={viewportConfig}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
