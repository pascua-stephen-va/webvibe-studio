import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function SectionReveal({
  children,
  delay = 0,
  className = '',
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
