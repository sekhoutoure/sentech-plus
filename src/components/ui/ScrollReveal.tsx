'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-up' | 'scale-up';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  style = {},
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const animationStyles: Record<string, React.CSSProperties> = {
    'fade-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    },
    'fade-in': {
      opacity: isVisible ? 1 : 0,
      transition: `opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    },
    'slide-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    },
    'scale-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      transition: `opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    },
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...animationStyles[animation],
      }}
    >
      {children}
    </div>
  );
}
