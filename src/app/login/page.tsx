'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to account page
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      router.replace('/compte');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    setLoading(true);

    // Mock API delay
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      if (!isLogin) {
        localStorage.setItem('userName', name);
        showToast('Inscription réussie ! Bienvenue chez SenTech Plus.', 'success');
      } else {
        localStorage.setItem('userName', 'Moussa Diallo'); // default mock user name
        showToast('Connexion réussie !', 'success');
      }
      router.replace('/compte');
      // Force page refresh or reload event to update navbar/context if needed
      window.dispatchEvent(new Event('storage'));
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 60px',
      background: 'var(--color-background)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        animation: 'fade-in 0.3s ease-out',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.875rem' }}>
            {isLogin ? 'Accédez à vos commandes et avantages exclusifs' : 'Rejoignez le club SenTech Plus'}
          </p>
        </div>

        {/* Card */}
        <div className="sentech-card" style={{ padding: '32px 24px' }}>
          {/* View Toggle tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--color-sentech-dark)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '28px',
          }}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                background: isLogin ? 'var(--color-sentech-card)' : 'transparent',
                color: isLogin ? 'var(--color-foreground)' : 'var(--color-sentech-muted)',
                fontWeight: isLogin ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                background: !isLogin ? 'var(--color-sentech-card)' : 'transparent',
                color: !isLogin ? 'var(--color-foreground)' : 'var(--color-sentech-muted)',
                fontWeight: !isLogin ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Inscription
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="reg-name" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
                  Nom complet
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sentech-muted)' }} />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="Moussa Diallo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-dark"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="auth-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
                Adresse e-mail
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sentech-muted)' }} />
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="moussa.diallo@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-dark"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label htmlFor="auth-password" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Mot de passe
                </label>
                {isLogin && (
                  <Link href="#" style={{ fontSize: '0.75rem', color: '#1b75bc', textDecoration: 'none' }} onClick={() => showToast('Lien de réinitialisation envoyé par mail.', 'info')}>
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sentech-muted)' }} />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-dark"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-sentech-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '10px',
                fontSize: '0.95rem',
                justifyContent: 'center',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Traitement en cours...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Secure disclaimer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--color-sentech-muted)',
            fontSize: '0.72rem',
            marginTop: '24px',
            borderTop: '1px solid var(--color-sentech-border)',
            paddingTop: '16px',
          }}>
            <ShieldCheck size={14} color="#10b981" />
            Connexion SSL sécurisée à 256 bits
          </div>
        </div>
      </div>
    </div>
  );
}
