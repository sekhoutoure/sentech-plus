'use client';

import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 'technologie-gan',
    title: 'Pourquoi la technologie GaN révolutionne la charge rapide',
    excerpt: 'Découvrez comment le Nitrure de Gallium (GaN) permet de créer des chargeurs deux fois plus petits, trois fois plus rapides et beaucoup plus écologiques.',
    image: '/charger.jpg',
    category: 'Guide Technique',
    date: '15 Juillet 2026',
    author: 'Equipe SenTech',
    readTime: '4 min read',
  },
  {
    id: 'prolonger-batterie-smartphone',
    title: '5 conseils d\'experts pour prolonger la vie de votre batterie',
    excerpt: 'Ne laissez plus votre smartphone s\'épuiser prématurément. Découvrez les habitudes simples et les pièges à éviter pour préserver l\'autonomie.',
    image: '/powerbank.jpg',
    category: 'Conseils Tech',
    date: '08 Juillet 2026',
    author: 'Equipe SenTech',
    readTime: '5 min read',
  },
  {
    id: 'choisir-ecouteurs-sans-fil',
    title: 'Écouteurs TWS : Guide pour bien choisir son modèle',
    excerpt: 'Réduction de bruit active, codecs audio, latence, étanchéité... Nous décryptons pour vous toutes les caractéristiques essentielles des écouteurs modernes.',
    image: '/earbuds.jpg',
    category: 'Guide d\'achat',
    date: '28 Juin 2026',
    author: 'Equipe SenTech',
    readTime: '6 min read',
  },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>
            Actualités
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--color-foreground)', marginTop: '10px', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
            Le Blog <span className="sentech-gradient-text">SenTech Plus</span>
          </h1>
          <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto' }}>
            Décryptages, guides d&apos;achat et astuces pour tirer le meilleur parti de vos gadgets high-tech.
          </p>
        </div>

        {/* Featured Article */}
        {articles.length > 0 && (
          <article className="sentech-card blog-featured-grid" style={{ overflow: 'hidden', padding: 0, marginBottom: '48px' }}>
            <div style={{ position: 'relative', minHeight: '300px', width: '100%' }}>
              <Image
                src={articles[0].image}
                alt={articles[0].title}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <span className="badge-new" style={{ position: 'absolute', top: '20px', left: '20px', background: '#1b75bc', fontSize: '0.78rem' }}>
                À la une
              </span>
            </div>
            <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.72rem', color: '#1b75bc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {articles[0].category}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif', lineHeight: 1.3 }}>
                {articles[0].title}
              </h2>
              <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {articles[0].excerpt}
              </p>
              <div style={{ display: 'flex', gap: '16px', color: '#475569', fontSize: '0.78rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {articles[0].date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {articles[0].readTime}</span>
              </div>
              <button className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px', fontSize: '0.85rem' }}>
                Lire l&apos;article <ArrowRight size={15} />
              </button>
            </div>
          </article>
        )}

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }} className="product-grid">
          {articles.slice(1).map(article => (
            <article key={article.id} className="sentech-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '0.68rem', color: '#1b75bc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {article.category}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif', lineHeight: 1.3 }}>
                  {article.title}
                </h3>
                <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {article.excerpt}
                </p>
                <div style={{ display: 'flex', gap: '12px', color: '#475569', fontSize: '0.75rem', marginTop: 'auto', paddingTop: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} /> {article.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {article.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
