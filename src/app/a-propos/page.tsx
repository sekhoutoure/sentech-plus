'use client';

import Link from 'next/link';
import { Zap, Users, Award, Heart, Globe, ShoppingCart, Mail, MapPin } from 'lucide-react';



const team = [
  {
    name: 'Ousmane Diallo',
    role: 'Fondateur & CEO',
    emoji: '👨🏾‍💼',
    bio: 'Passionné de technologie depuis 15 ans, Ousmane a fondé SenTech Plus avec la vision de rendre la tech premium accessible à tous en Afrique de l\'Ouest.',
  },
  {
    name: 'Fatou Ndiaye',
    role: 'Directrice Produit',
    emoji: '👩🏾‍💻',
    bio: 'Experte en sélection de produits tech, Fatou s\'assure que chaque article vendu sur SenTech Plus respecte nos standards de qualité les plus élevés.',
  },
  {
    name: 'Mamadou Sow',
    role: 'Responsable Logistique',
    emoji: '👨🏾‍🚀',
    bio: 'Mamadou supervise notre réseau de livraison et s\'assure que chaque colis arrive dans les meilleures conditions dans les délais promis.',
  },
  {
    name: 'Aïssatou Balde',
    role: 'Support Client',
    emoji: '👩🏾‍🎧',
    bio: 'Aïssatou et son équipe sont disponibles 7j/7 pour vous aider, que ce soit par WhatsApp, email ou téléphone.',
  },
];

export default function AProposPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '100px 24px 80px',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(27,117,188,0.06) 0%, transparent 60%), var(--color-background)',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 28px',
            background: 'linear-gradient(135deg, #1b75bc, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(27,117,188,0.4)',
          }}>
            <Zap size={36} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>
            Notre histoire
          </span>
          <h1 className="section-title" style={{ marginTop: '10px', marginBottom: '20px', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Technologie premium,<br /><span className="sentech-gradient-text">accessible à tous</span>
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '28px' }}>
            SenTech Plus est née en 2021 d&apos;une passion pour la technologie et d&apos;une vision simple :
            rendre les meilleurs gadgets high-tech accessibles à tous en Afrique de l&apos;Ouest,
            avec des prix justes et un service client irréprochable.
          </p>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.8' }}>
            Basés à <strong style={{ color: 'var(--color-foreground)' }}>Dakar, Sénégal</strong>, nous livrons dans tout le pays
            et construisons chaque jour une communauté de passionnés de technologie.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '60px 24px',
        background: 'linear-gradient(135deg, rgba(27,117,188,0.04), transparent)',
        borderBottom: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }} className="about-stats-grid">
          {[
            { value: '5,000+', label: 'Clients satisfaits', emoji: '🎉' },
            { value: '200+', label: 'Produits référencés', emoji: '📦' },
            { value: '4.8★', label: 'Note moyenne client', emoji: '⭐' },
            { value: '3 ans', label: 'D\'expérience', emoji: '🏆' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.emoji}</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1b75bc', fontFamily: 'Outfit, sans-serif', marginBottom: '6px' }}>
                {s.value}
              </div>
              <div style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>
            Ce qui nous guide
          </span>
          <h2 className="section-title" style={{ marginTop: '10px', marginBottom: '12px' }}>
            Nos <span className="sentech-gradient-text">valeurs</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { icon: <Award size={28} />, title: 'Qualité Premium', desc: 'Nous sélectionnons rigoureusement chaque produit. Seul ce que nous utiliserions nous-mêmes entre dans notre catalogue.' },
            { icon: <Heart size={28} />, title: 'Satisfaction Client', desc: 'Votre satisfaction est notre priorité absolue. Retours facilités, support 7j/7, nous sommes là pour vous.' },
            { icon: <Globe size={28} />, title: 'Accessibilité', desc: 'Rendre la technologie premium accessible à tous les budgets en Afrique de l\'Ouest, sans compromis sur la qualité.' },
            { icon: <Users size={28} />, title: 'Communauté', desc: 'Nous construisons une communauté de passionnés tech au Sénégal qui partagent conseils, avis et découvertes.' },
          ].map(v => (
            <div key={v.title} className="sentech-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 20px',
                background: 'rgba(27,117,188,0.1)', border: '1px solid rgba(27,117,188,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b75bc',
              }}>
                {v.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '10px' }}>{v.title}</h3>
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.7' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, rgba(27,117,188,0.03), transparent)',
        borderTop: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>
              L&apos;équipe
            </span>
            <h2 className="section-title" style={{ marginTop: '10px', marginBottom: '12px' }}>
              Des personnes <span className="sentech-gradient-text">passionnées</span>
            </h2>
            <p style={{ color: '#475569', maxWidth: '480px', margin: '0 auto' }}>
              Derrière SenTech Plus, une équipe dédiée qui travaille chaque jour pour vous offrir la meilleure expérience tech.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {team.map(member => (
              <div key={member.name} style={{
                background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                borderRadius: '20px', padding: '32px 24px', textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(27,117,188,0.3)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-sentech-border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, rgba(27,117,188,0.1), rgba(37,99,235,0.1))',
                  border: '2px solid rgba(27,117,188,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                }}>
                  {member.emoji}
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--color-foreground)', fontSize: '1rem', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>
                  {member.name}
                </h3>
                <div style={{ color: '#1b75bc', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  {member.role}
                </div>
                <p style={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.6 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid var(--color-sentech-border)' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
          Rejoignez la communauté SenTech
        </h2>
        <p style={{ color: '#475569', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
          Des milliers de clients font déjà confiance à SenTech Plus pour leurs achats tech au Sénégal.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/boutique">
            <button className="btn-primary" style={{ padding: '14px 32px' }}>
              <ShoppingCart size={18} /> Voir la boutique
            </button>
          </Link>
          <Link href="/contact">
            <button className="btn-secondary" style={{ padding: '14px 32px' }}>
              <Mail size={18} /> Nous contacter
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
