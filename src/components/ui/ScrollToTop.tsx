'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(pct);
      setVisible(scrolled > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progression de lecture"
      />
      {/* Scroll to top button */}
      {visible && (
        <button
          onClick={scrollTop}
          className="scroll-top-btn"
          aria-label="Retour en haut de la page"
          title="Retour en haut"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
