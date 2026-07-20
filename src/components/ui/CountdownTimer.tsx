'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        background: 'var(--color-sentech-dark)',
        border: '1px solid var(--color-sentech-border)',
        borderRadius: '12px',
        padding: '10px 12px',
        minWidth: '58px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(27,117,188,0.06), transparent)',
          pointerEvents: 'none',
        }} />
        <span style={{
          display: 'block',
          fontSize: '1.75rem',
          fontWeight: 800,
          fontFamily: 'Outfit, sans-serif',
          color: 'var(--color-foreground)',
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}>
          {display}
        </span>
      </div>
      <span style={{
        display: 'block',
        fontSize: '0.68rem',
        fontWeight: 600,
        color: 'var(--color-sentech-muted)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginTop: '6px',
      }}>
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ targetDate, label = "Offre se termine dans" }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 0);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [targetDate]);

  const isExpired = mounted && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div style={{ textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>
        ⏱ Cette offre est expirée
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {label && (
        <p style={{
          fontSize: '0.82rem', color: 'var(--color-sentech-muted)', marginBottom: '12px',
          textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600,
        }}>
          ⏱ {label}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
        <TimeBlock value={timeLeft.days} label="Jours" />
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b75bc', marginBottom: '20px' }}>:</span>
        <TimeBlock value={timeLeft.hours} label="Heures" />
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b75bc', marginBottom: '20px' }}>:</span>
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b75bc', marginBottom: '20px' }}>:</span>
        <TimeBlock value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}
