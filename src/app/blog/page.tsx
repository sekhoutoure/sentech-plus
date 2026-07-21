'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ArrowLeft, Search } from 'lucide-react';

const articles = [
  {
    id: 'technologie-gan',
    title: 'Pourquoi la technologie GaN révolutionne la charge rapide',
    excerpt: 'Découvrez comment le Nitrure de Gallium (GaN) permet de créer des chargeurs deux fois plus petits, trois fois plus rapides et beaucoup plus écologiques.',
    content: `
La technologie GaN (Nitrure de Gallium) représente une révolution silencieuse dans le domaine de la charge rapide. Contrairement au silicium traditionnel, le GaN permet aux électrons de voyager beaucoup plus rapidement, réduisant ainsi les pertes d'énergie sous forme de chaleur.

**Les avantages clés :**
- **Compacité** : Les chargeurs GaN sont jusqu'à 40% plus petits que leurs équivalents silicium
- **Efficacité** : Jusqu'à 95% d'efficacité énergétique contre 80% pour le silicium
- **Polyvalence** : Un seul chargeur pour laptop, smartphone et tablette simultanément
- **Durabilité** : Moins de chaleur produite = composants qui durent plus longtemps

Chez SenTech Plus, tous nos chargeurs de la gamme Pro utilisent la technologie GaN de 3ème génération, vous offrant la meilleure expérience de charge du marché.
    `,
    image: '/charger.jpg',
    category: 'Guide Technique',
    date: '15 Juillet 2026',
    author: 'Équipe SenTech',
    readTime: '4 min',
    tags: ['GaN', 'Chargeur', 'Technologie'],
  },
  {
    id: 'prolonger-batterie-smartphone',
    title: '5 conseils d\'experts pour prolonger la vie de votre batterie',
    excerpt: 'Ne laissez plus votre smartphone s\'épuiser prématurément. Découvrez les habitudes simples et les pièges à éviter pour préserver l\'autonomie.',
    content: `
La batterie est souvent le premier composant à montrer des signes d'usure. Voici 5 conseils éprouvés pour prolonger sa durée de vie.

**1. Évitez les charges à 100% constantes**
Idéalement, maintenez votre batterie entre 20% et 80%. Les batteries lithium-ion vivent mieux dans cette plage.

**2. Évitez la surchauffe**
La chaleur est l'ennemie numéro 1 des batteries. Ne laissez pas votre téléphone au soleil et évitez de charger sous une coque épaisse.

**3. Utilisez un chargeur adapté**
Un chargeur certifié avec la bonne puissance préserve mieux votre batterie qu'un chargeur générique.

**4. Activez l'optimisation de charge**
iOS et Android proposent une option "Charge optimisée" qui apprend vos habitudes et évite la surcharge.

**5. Une recharge complète par semaine**
Une fois par semaine, videz complètement puis rechargez à 100% pour calibrer l'indicateur de batterie.
    `,
    image: '/powerbank.jpg',
    category: 'Conseils Tech',
    date: '08 Juillet 2026',
    author: 'Équipe SenTech',
    readTime: '5 min',
    tags: ['Batterie', 'Smartphone', 'Conseils'],
  },
  {
    id: 'choisir-ecouteurs-sans-fil',
    title: 'Écouteurs TWS : Guide pour bien choisir son modèle',
    excerpt: 'Réduction de bruit active, codecs audio, latence, étanchéité... Nous décryptons pour vous toutes les caractéristiques essentielles.',
    content: `
Le marché des écouteurs sans fil (TWS - True Wireless Stereo) est aujourd'hui très vaste. Voici les critères essentiels à regarder.

**1. La réduction de bruit active (ANC)**
L'ANC utilise des microphones pour analyser et contrer le bruit ambiant. Indispensable pour les transports ou le bureau en open-space.

**2. Les codecs audio**
- **SBC** : Standard, compatible partout
- **AAC** : Meilleure qualité sur Apple
- **aptX** : Haute qualité sur Android  
- **LDAC** : Qualité Hi-Fi (Sony)

**3. L'autonomie réelle**
Méfiez-vous des chiffres marketing. L'autonomie réelle avec ANC activée est souvent 30% inférieure aux annonces.

**4. L'étanchéité (IPX)**
- **IPX4** : Résistant à la transpiration
- **IPX7** : Submersible 30 min

**5. La latence**
Pour le gaming ou les vidéos, cherchez une latence inférieure à 60ms. Sinon, le son sera en décalage avec l'image.

Nos modèles SenTech Pro X1 combinent ANC, codec aptX et autonomie de 40h pour une expérience audio exceptionnelle.
    `,
    image: '/earbuds.jpg',
    category: 'Guide d\'achat',
    date: '28 Juin 2026',
    author: 'Équipe SenTech',
    readTime: '6 min',
    tags: ['Écouteurs', 'Audio', 'Guide'],
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const categories = [...new Set(articles.map(a => a.category))];
  const filtered = articles.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || a.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>
            Actualités
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--color-foreground)', marginTop: '10px', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
            Le Blog <span className="sentech-gradient-text">SenTech Plus</span>
          </h1>
          <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto 32px' }}>
            Guides d&apos;achat, conseils tech et actualités pour vous aider à choisir les meilleurs accessoires.
          </p>

          {/* Search & filters */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                className="input-dark"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => setSelectedCat('')}
                style={{
                  padding: '8px 16px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
                  border: '1px solid', cursor: 'pointer',
                  background: !selectedCat ? '#1b75bc' : 'transparent',
                  color: !selectedCat ? 'white' : '#475569',
                  borderColor: !selectedCat ? '#1b75bc' : 'var(--color-sentech-border)',
                }}
              >
                Tous
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat === selectedCat ? '' : cat)}
                  style={{
                    padding: '8px 16px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
                    border: '1px solid', cursor: 'pointer',
                    background: selectedCat === cat ? '#1b75bc' : 'transparent',
                    color: selectedCat === cat ? 'white' : '#475569',
                    borderColor: selectedCat === cat ? '#1b75bc' : 'var(--color-sentech-border)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <p>Aucun article trouvé pour &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {filtered.map((article) => (
              <Link key={article.id} href={`/blog/${article.id}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                  borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(27,117,188,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-sentech-border)';
                  }}
                >
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <Image src={article.image} alt={article.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: 'rgba(27,117,188,0.9)', backdropFilter: 'blur(4px)',
                      color: 'white', padding: '4px 12px', borderRadius: '100px',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      {article.category}
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', color: '#475569', fontSize: '0.75rem', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {article.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {article.readTime} de lecture
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '10px', lineHeight: 1.4, fontFamily: 'Outfit, sans-serif' }}>
                      {article.title}
                    </h2>
                    <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px' }}>
                      {article.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1b75bc', fontSize: '0.85rem', fontWeight: 600 }}>
                      Lire l&apos;article <ArrowRight size={14} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
