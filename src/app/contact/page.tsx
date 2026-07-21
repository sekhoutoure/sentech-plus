'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { saveContactMessage } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Pre-fill name/email if logged in
  useEffect(() => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    if (name || email) setForm(f => ({ ...f, name: name || '', email: email || '' }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { error } = await saveContactMessage(form);
      if (error) {
        showToast('Erreur lors de l\'envoi. Réessayez ou contactez-nous par WhatsApp.', 'error');
      } else {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        showToast('✅ Message envoyé ! Nous répondrons sous 24h.', 'success');
        setTimeout(() => setSent(false), 6000);
      }
    } catch {
      showToast('Une erreur est survenue. Essayez WhatsApp.', 'error');
    } finally {
      setSending(false);
    }
  };

  // ⚠️ Mettez à jour ces informations avec vos vraies coordonnées
  const socialLinks = [
    { label: 'Facebook',  href: '#', color: '#1877F2', emoji: '📘' },
    { label: 'Instagram', href: '#', color: '#E4405F', emoji: '📷' },
    { label: 'WhatsApp',  href: '#', color: '#25D366', emoji: '💬' },
    { label: 'TikTok',    href: '#', color: '#000000', emoji: '🎵' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>
            Nous contacter
          </span>
          <h1 className="section-title" style={{ marginTop: '8px', marginBottom: '12px' }}>
            Parlons de votre <span className="sentech-gradient-text">demande</span>
          </h1>
          <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto' }}>
            Notre équipe est disponible 7j/7 pour répondre à toutes vos questions.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact info */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {[
                { icon: <Phone size={20} />, title: 'Téléphone', value: 'À renseigner', sub: 'Lun-Sam 8h-20h', href: null },
                { icon: <Mail size={20} />, title: 'Email', value: 'contact@sentechplus.com', sub: 'Réponse sous 24h', href: 'mailto:contact@sentechplus.com' },
                { icon: <MapPin size={20} />, title: 'Adresse', value: 'Dakar, Sénégal', sub: 'Afrique de l\'Ouest', href: null },
                { icon: <Clock size={20} />, title: 'Horaires', value: 'À renseigner', sub: 'Ajoutez vos heures d\'ouverture', href: null },
              ].map(item => {
                const inner = (
                  <div key={item.title} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '18px', borderRadius: '14px',
                    background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                    transition: 'border-color 0.2s', cursor: item.href ? 'pointer' : 'default',
                    textDecoration: 'none',
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: 'rgba(27,117,188,0.1)', border: '1px solid rgba(27,117,188,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b75bc',
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ color: 'var(--color-foreground)', fontWeight: 700, fontSize: '0.95rem' }}>{item.value}</div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>{item.sub}</div>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={item.title} href={item.href} style={{ textDecoration: 'none' }}>{inner}</a>
                ) : (
                  <div key={item.title}>{inner}</div>
                );
              })}
            </div>

            {/* Social links — réels et cliquables */}
            <div style={{
              padding: '24px', borderRadius: '14px',
              background: 'rgba(27,117,188,0.05)', border: '1px solid rgba(27,117,188,0.15)',
            }}>
              <h3 style={{ color: 'var(--color-foreground)', fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem' }}>
                Suivez-nous sur les réseaux
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {socialLinks.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '9px 16px', borderRadius: '10px',
                      background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                      color: 'var(--color-foreground)', fontSize: '0.85rem', fontWeight: 600,
                      textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = s.color;
                      (e.currentTarget as HTMLAnchorElement).style.color = s.color;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-sentech-border)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-foreground)';
                    }}
                  >
                    <span>{s.emoji}</span> {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  marginTop: '16px', padding: '18px 20px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(37,211,102,0.1), rgba(37,211,102,0.05))',
                  border: '1px solid rgba(37,211,102,0.3)', textDecoration: 'none',
                  opacity: 0.6, cursor: 'not-allowed',
                }}
              >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <div style={{ color: '#25D366', fontWeight: 700, fontSize: '0.95rem' }}>Réponse rapide sur WhatsApp</div>
                <div style={{ color: '#475569', fontSize: '0.8rem' }}>En général, réponse en moins de 30 minutes</div>
              </div>
            </a>
          </div>

          {/* Form */}
          <div style={{
            background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
            borderRadius: '20px', padding: '36px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <MessageSquare size={20} color="#1b75bc" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Envoyez-nous un message</h2>
            </div>

            {sent && (
              <div style={{
                padding: '16px 20px', borderRadius: '12px', marginBottom: '20px',
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: 600 }}>Message envoyé ! Nous vous répondrons sous 24h.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--color-foreground)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '7px' }}>
                    Nom <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="contact-name" type="text" required
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Votre nom" className="input-dark"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--color-foreground)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '7px' }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="contact-email" type="email" required
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="votre@email.com" className="input-dark"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--color-foreground)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '7px' }}>
                  Sujet
                </label>
                <select
                  id="contact-subject"
                  value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="input-dark" style={{ cursor: 'pointer' }}
                >
                  <option value="">Choisir un sujet...</option>
                  <option>Commande &amp; livraison</option>
                  <option>Retour &amp; remboursement</option>
                  <option>Produit défectueux</option>
                  <option>Information produit</option>
                  <option>Partenariat</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--color-foreground)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '7px' }}>
                  Message <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="contact-message" required rows={5}
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Décrivez votre demande en détail..."
                  className="input-dark" style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              <button
                id="contact-submit-btn" type="submit" disabled={sending}
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: sending ? 0.7 : 1 }}
              >
                <Send size={18} /> {sending ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569' }}>
                Vos données sont utilisées uniquement pour répondre à votre demande.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
