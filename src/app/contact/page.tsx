'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>
          Nous contacter
        </span>
        <h1 className="section-title" style={{ marginTop: '8px', marginBottom: '12px' }}>
          Parlons de votre <span className="sentech-gradient-text">projet</span>
        </h1>
        <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto' }}>
          Notre équipe est disponible 7j/7 pour répondre à toutes vos questions.
        </p>
      </div>

      <div className="contact-grid">
        {/* Contact info */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: <Phone size={20} />, title: 'Téléphone', value: '+221 77 000 00 00', sub: 'Lun-Sam 8h-20h' },
              { icon: <Mail size={20} />, title: 'Email', value: 'contact@sentechplus.com', sub: 'Réponse sous 24h' },
              { icon: <MapPin size={20} />, title: 'Adresse', value: 'Dakar, Sénégal', sub: 'Afrique de l\'Ouest' },
              { icon: <Clock size={20} />, title: 'Horaires', value: 'Lun-Sam 8h-20h', sub: 'Dim 10h-18h' },
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px', borderRadius: '14px',
                background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(27,117,188,0.1)', border: '1px solid rgba(27,117,188,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b75bc',
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.title}</div>
                  <div style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{item.value}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div style={{ padding: '24px', borderRadius: '14px', background: 'rgba(27,117,188,0.05)', border: '1px solid rgba(27,117,188,0.15)' }}>
            <h3 style={{ color: 'var(--color-foreground)', fontWeight: 600, marginBottom: '12px', fontSize: '0.95rem' }}>
              Suivez-nous sur les réseaux
            </h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Facebook', 'Instagram', 'WhatsApp', 'TikTok'].map(s => (
                <div key={s} style={{
                  padding: '8px 14px', borderRadius: '8px',
                  background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
                  color: 'var(--color-sentech-muted)', fontSize: '0.8rem', cursor: 'pointer',
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
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
              padding: '16px', borderRadius: '10px', marginBottom: '20px',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ✓ Message envoyé ! Nous vous répondrons sous 24h.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--color-sentech-muted)', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Nom *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Votre nom"
                  className="sentech-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--color-sentech-muted)', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="votre@email.com"
                  className="sentech-input"
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--color-sentech-muted)', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Sujet
              </label>
              <select
                id="contact-subject"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="sentech-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="">Choisir un sujet...</option>
                <option>Commande & livraison</option>
                <option>Retour & remboursement</option>
                <option>Produit défectueux</option>
                <option>Information produit</option>
                <option>Partenariat</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--color-sentech-muted)', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Message *
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Décrivez votre demande..."
                className="sentech-input"
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <button
              id="contact-submit-btn"
              type="submit"
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
            >
              <Send size={18} /> Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
