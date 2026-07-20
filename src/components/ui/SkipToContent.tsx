'use client';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '0',
        background: '#1b75bc',
        color: 'white',
        padding: '8px 16px',
        zIndex: 99999,
        transition: 'top 0.1s',
        borderRadius: '0 0 8px 0',
        fontWeight: 600,
        fontSize: '0.875rem',
        textDecoration: 'none',
      }}
      onFocus={e => { (e.currentTarget as HTMLElement).style.top = '0'; }}
      onBlur={e => { (e.currentTarget as HTMLElement).style.top = '-40px'; }}
    >
      Aller au contenu principal
    </a>
  );
}
