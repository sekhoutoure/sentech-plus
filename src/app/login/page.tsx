'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, Zap, Star, Package, ChevronRight, Phone } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const benefits = [
  { icon: <Package size={18} />, title: 'Suivi de commandes', desc: 'Suivez vos livraisons en temps réel' },
  { icon: <Star size={18} />, title: 'Offres exclusives', desc: 'Accès aux ventes privées et promotions' },
  { icon: <Zap size={18} />, title: 'Checkout rapide', desc: 'Sauvegardez vos adresses et paiements' },
];

// Password strength checker
function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: '', color: '' },
    { label: 'Faible', color: '#ef4444' },
    { label: 'Moyen', color: '#f59e0b' },
    { label: 'Bien', color: '#3b82f6' },
    { label: 'Fort', color: '#10b981' },
  ];
  return { score, ...map[score] };
}

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const strength = getPasswordStrength(password);

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

    if (!isLogin && password !== confirmPassword) {
      showToast('Les mots de passe ne correspondent pas.', 'error');
      return;
    }

    if (!isLogin && !acceptTerms) {
      showToast("Veuillez accepter les conditions d'utilisation.", 'error');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      if (!isLogin) {
        localStorage.setItem('userName', name);
        showToast('🎉 Inscription réussie ! Bienvenue chez SenTech Plus.', 'success');
      } else {
        localStorage.setItem('userName', 'Moussa Diallo');
        showToast('✅ Connexion réussie ! Bon retour.', 'success');
      }
      router.replace('/compte');
      window.dispatchEvent(new Event('storage'));
    }, 1400);
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhone('');
    setAcceptTerms(false);
    setFocusedField('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-background)',
    }}>
      {/* LEFT PANEL — Visual branding */}
      <div className="auth-left-panel" style={{
        flex: '0 0 42%',
        background: 'linear-gradient(145deg, #0f1a2e 0%, #1b3b6a 50%, #1b75bc 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1b75bc' }}>S+</span>
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif' }}>
              SenTech <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Plus</span>
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div>
          <h2 style={{
            color: 'white', fontSize: '2rem', fontWeight: 800,
            lineHeight: 1.2, marginBottom: '16px', fontFamily: 'Outfit, sans-serif',
          }}>
            {isLogin
              ? 'Bon retour parmi nous ! 👋'
              : 'Rejoignez la communauté SenTech Plus 🚀'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '36px' }}>
            {isLogin
              ? 'Accédez à votre espace client pour suivre vos commandes et profiter d\'offres exclusives.'
              : 'Créez votre compte gratuitement et commencez à profiter d\'avantages exclusifs réservés à nos membres.'}
          </p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{b.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
          © 2026 SenTech Plus · Sécurisé par SSL 256 bits
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '440px', animation: 'fade-in 0.35s ease-out' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '1.75rem', fontWeight: 800,
              color: 'var(--color-foreground)', marginBottom: '6px',
              fontFamily: 'Outfit, sans-serif',
            }}>
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </h1>
            <p style={{ color: '#475569', fontSize: '0.875rem' }}>
              {isLogin
                ? 'Nouveau ici ?'
                : 'Vous avez déjà un compte ?'}{' '}
              <button
                onClick={() => switchMode(!isLogin)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#1b75bc', fontWeight: 600, fontSize: '0.875rem', padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {isLogin ? 'Créer un compte gratuitement' : 'Se connecter'}
              </button>
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--color-sentech-dark)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '28px',
            border: '1px solid var(--color-sentech-border)',
          }}>
            {['Connexion', 'Inscription'].map((tab, i) => {
              const active = (i === 0) === isLogin;
              return (
                <button
                  key={tab}
                  onClick={() => switchMode(i === 0)}
                  style={{
                    flex: 1, padding: '10px 14px', border: 'none', borderRadius: '9px',
                    background: active ? '#1b75bc' : 'transparent',
                    color: active ? 'white' : '#475569',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.875rem', cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: active ? '0 4px 12px rgba(27,117,188,0.35)' : 'none',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Name (register) */}
            {!isLogin && (
              <div>
                <label htmlFor="reg-name" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '7px' }}>
                  Nom complet <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: focusedField === 'name' ? '#1b75bc' : '#475569', transition: 'color 0.2s' }} />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="Moussa Diallo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    className="input-dark"
                    style={{
                      paddingLeft: '42px',
                      borderColor: focusedField === 'name' ? '#1b75bc' : '',
                      boxShadow: focusedField === 'name' ? '0 0 0 3px rgba(27,117,188,0.12)' : '',
                      transition: 'all 0.2s',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Phone (register) */}
            {!isLogin && (
              <div>
                <label htmlFor="reg-phone" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '7px' }}>
                  Téléphone <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optionnel)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: focusedField === 'phone' ? '#1b75bc' : '#475569', transition: 'color 0.2s' }} />
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    className="input-dark"
                    style={{
                      paddingLeft: '42px',
                      borderColor: focusedField === 'phone' ? '#1b75bc' : '',
                      boxShadow: focusedField === 'phone' ? '0 0 0 3px rgba(27,117,188,0.12)' : '',
                      transition: 'all 0.2s',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="auth-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '7px' }}>
                Adresse e-mail <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: focusedField === 'email' ? '#1b75bc' : '#475569', transition: 'color 0.2s' }} />
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="moussa.diallo@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="input-dark"
                  style={{
                    paddingLeft: '42px',
                    borderColor: focusedField === 'email' ? '#1b75bc' : '',
                    boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(27,117,188,0.12)' : '',
                    transition: 'all 0.2s',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label htmlFor="auth-password" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Mot de passe <span style={{ color: '#ef4444' }}>*</span>
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => showToast('Lien de réinitialisation envoyé !', 'info')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b75bc', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: focusedField === 'password' ? '#1b75bc' : '#475569', transition: 'color 0.2s' }} />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="input-dark"
                  style={{
                    paddingLeft: '42px', paddingRight: '44px',
                    borderColor: focusedField === 'password' ? '#1b75bc' : '',
                    boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(27,117,188,0.12)' : '',
                    transition: 'all 0.2s',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex' }}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar (register only) */}
              {!isLogin && password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: '3px', borderRadius: '2px',
                          background: i <= strength.score ? strength.color : 'var(--color-sentech-border)',
                          transition: 'background 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600 }}>
                    {strength.label && `Sécurité : ${strength.label}`}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password (register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="auth-confirm-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '7px' }}>
                  Confirmer le mot de passe <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: focusedField === 'confirm' ? '#1b75bc' : '#475569', transition: 'color 0.2s' }} />
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField('')}
                    className="input-dark"
                    style={{
                      paddingLeft: '42px', paddingRight: '44px',
                      borderColor: confirmPassword && confirmPassword !== password ? '#ef4444' : focusedField === 'confirm' ? '#1b75bc' : '',
                      boxShadow: focusedField === 'confirm' ? '0 0 0 3px rgba(27,117,188,0.12)' : '',
                      transition: 'all 0.2s',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex' }}
                    aria-label="Afficher/masquer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '5px' }}>⚠ Les mots de passe ne correspondent pas</p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '5px' }}>✓ Les mots de passe correspondent</p>
                )}
              </div>
            )}

            {/* Terms checkbox (register only) */}
            {!isLogin && (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  style={{ marginTop: '2px', accentColor: '#1b75bc', width: '16px', height: '16px', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
                  J&apos;accepte les{' '}
                  <Link href="#" style={{ color: '#1b75bc', fontWeight: 600 }}>conditions d&apos;utilisation</Link>
                  {' '}et la{' '}
                  <Link href="#" style={{ color: '#1b75bc', fontWeight: 600 }}>politique de confidentialité</Link>
                </span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1b75bc, #2563eb)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(27,117,188,0.4)',
                transition: 'all 0.25s ease',
                transform: 'translateY(0)',
                marginTop: '4px',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  Traitement en cours...
                </>
              ) : (
                <>
                  {isLogin ? 'Se connecter' : 'Créer mon compte'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-sentech-border)' }} />
            <span style={{ fontSize: '0.75rem', color: '#475569' }}>ou continuer avec</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-sentech-border)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { name: 'Google', bg: 'white', color: '#374151', border: '#e5e7eb', icon: '🇬' },
              { name: 'Facebook', bg: '#1877f2', color: 'white', border: '#1877f2', icon: 'f' },
            ].map(s => (
              <button
                key={s.name}
                type="button"
                onClick={() => showToast(`Connexion avec ${s.name} - Bientôt disponible !`, 'info')}
                style={{
                  flex: 1, padding: '12px', border: `1px solid ${s.border}`,
                  borderRadius: '10px', background: s.bg, color: s.color,
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <span style={{ fontWeight: 900 }}>{s.icon}</span> {s.name}
              </button>
            ))}
          </div>

          {/* Security disclaimer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', color: '#475569', fontSize: '0.72rem',
            marginTop: '28px', paddingTop: '20px',
            borderTop: '1px solid var(--color-sentech-border)',
          }}>
            <ShieldCheck size={14} color="#10b981" />
            Connexion SSL sécurisée · Vos données sont protégées
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
