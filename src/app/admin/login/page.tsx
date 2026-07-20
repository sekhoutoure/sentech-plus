'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldAlert, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to admin page
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdminLoggedIn');
    if (loggedIn === 'true') {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showToast('Veuillez remplir tous les champs.', 'error');
      return;
    }

    setLoading(true);

    // Mock API validation
    setTimeout(() => {
      setLoading(false);
      
      // Simple verification
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        localStorage.setItem('isAdminLoggedIn', 'true');
        showToast('Authentification administrateur réussie !', 'success');
        router.replace('/admin');
      } else {
        showToast('Identifiants incorrects. Indice : admin / admin123', 'error');
      }
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
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
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', width: '160px', height: '40px', margin: '0 auto 8px' }}>
            <Image
              src="/logo_horizontal_v2.png"
              alt="SenTech Plus"
              fill
              sizes="160px"
              style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
              priority
            />
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.65rem',
            color: '#1b75bc',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            background: 'rgba(27,117,188,0.06)',
            padding: '4px 10px',
            borderRadius: '100px',
            border: '1px solid rgba(27,117,188,0.15)',
          }}>
            <ShieldAlert size={12} /> Portail Administration
          </div>
        </div>

        {/* Card */}
        <div className="sentech-card" style={{ padding: '36px 28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
            Authentification requise
          </h2>
          <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.82rem', marginBottom: '24px' }}>
            Entrez vos paramètres de connexion administratifs pour accéder au tableau de bord.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username */}
            <div>
              <label htmlFor="admin-username" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
                Identifiant
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sentech-muted)' }} />
                <input
                  id="admin-username"
                  type="text"
                  required
                  placeholder="Ex: admin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="input-dark"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
                Mot de passe admin
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sentech-muted)' }} />
                <input
                  id="admin-password"
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

            {/* Submit */}
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
              {loading ? 'Connexion en cours...' : 'Se connecter'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Hint alert */}
          <div style={{
            background: 'rgba(27,117,188,0.05)',
            border: '1px solid rgba(27,117,188,0.15)',
            borderRadius: '10px',
            padding: '12px',
            marginTop: '20px',
            fontSize: '0.78rem',
            color: '#1b75bc',
            lineHeight: 1.4,
          }}>
            <strong>Identifiants de démonstration :</strong><br />
            Identifiant : <code>admin</code><br />
            Mot de passe : <code>admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
