import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';

const articles = [
  {
    id: 'technologie-gan',
    title: 'Pourquoi la technologie GaN révolutionne la charge rapide',
    excerpt: 'Découvrez comment le Nitrure de Gallium (GaN) permet de créer des chargeurs deux fois plus petits, trois fois plus rapides.',
    content: [
      { type: 'p', text: "La technologie GaN (Nitrure de Gallium) représente une révolution silencieuse dans le domaine de la charge rapide. Contrairement au silicium traditionnel, le GaN permet aux électrons de voyager beaucoup plus rapidement, réduisant ainsi les pertes d'énergie sous forme de chaleur." },
      { type: 'h2', text: 'Les avantages clés du GaN' },
      { type: 'list', items: ['Compacité : les chargeurs GaN sont jusqu\'à 40% plus petits', 'Efficacité : jusqu\'à 95% d\'efficacité énergétique vs 80% pour le silicium', 'Polyvalence : un seul chargeur pour laptop, smartphone et tablette', 'Durabilité : moins de chaleur = composants qui durent plus longtemps'] },
      { type: 'h2', text: 'Pourquoi choisir un chargeur GaN ?' },
      { type: 'p', text: "Pour les voyageurs et les professionnels, un chargeur GaN 65W peut remplacer 3 adaptateurs différents. C'est moins de poids dans le sac, moins de câbles, et une charge bien plus rapide. Les smartphones modernes profitent pleinement de la charge rapide 45W, réduisant le temps de charge à moins de 45 minutes." },
      { type: 'p', text: "Chez SenTech Plus, tous nos chargeurs de la gamme Pro utilisent la technologie GaN de 3ème génération, vous offrant la meilleure expérience de charge disponible sur le marché." },
    ],
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
    excerpt: 'Ne laissez plus votre smartphone s\'épuiser prématurément. Découvrez les habitudes simples pour préserver l\'autonomie.',
    content: [
      { type: 'p', text: "La batterie est souvent le premier composant à montrer des signes d'usure. Avec quelques habitudes simples, vous pouvez prolonger sa durée de vie de plusieurs années." },
      { type: 'h2', text: '1. Évitez les charges à 100% constantes' },
      { type: 'p', text: "Idéalement, maintenez votre batterie entre 20% et 80%. Les batteries lithium-ion vivent mieux dans cette plage. Une charge complète à 100% chaque nuit accélère la dégradation." },
      { type: 'h2', text: '2. Évitez la surchauffe' },
      { type: 'p', text: "La chaleur est l'ennemie numéro 1 des batteries. Ne laissez pas votre téléphone au soleil et évitez de charger sous une coque épaisse qui retient la chaleur." },
      { type: 'h2', text: '3. Utilisez un chargeur certifié' },
      { type: 'p', text: "Un chargeur certifié avec la bonne puissance préserve bien mieux votre batterie qu'un chargeur générique de mauvaise qualité. Investir dans un bon chargeur, c'est protéger votre smartphone." },
      { type: 'h2', text: '4. Activez l\'optimisation de charge' },
      { type: 'p', text: "iOS et Android proposent une option 'Charge optimisée' qui apprend vos habitudes et évite la surcharge nocturne. Activez-la dans les paramètres batterie." },
      { type: 'h2', text: '5. Une calibration par mois' },
      { type: 'p', text: "Une fois par mois, videz complètement votre batterie puis rechargez-la à 100% pour calibrer l'indicateur. Cela aide à maintenir la précision de l'affichage du niveau." },
    ],
    image: '/powerbank.jpg',
    category: 'Conseils Tech',
    date: '08 Juillet 2026',
    author: 'Équipe SenTech',
    readTime: '5 min',
    tags: ['Batterie', 'Smartphone', 'Conseils'],
  },
  {
    id: 'choisir-ecouteurs-sans-fil',
    title: 'Écouteurs TWS : Guide complet pour bien choisir',
    excerpt: 'Réduction de bruit active, codecs audio, latence, étanchéité... Nous décryptons toutes les caractéristiques essentielles.',
    content: [
      { type: 'p', text: "Le marché des écouteurs sans fil (TWS - True Wireless Stereo) est aujourd'hui immense. Face à des centaines de modèles, voici les critères essentiels pour faire le bon choix." },
      { type: 'h2', text: 'La réduction de bruit active (ANC)' },
      { type: 'p', text: "L'ANC utilise des microphones pour analyser et contrer le bruit ambiant. Indispensable pour les transports ou le bureau en open-space. Vérifiez l'efficacité réelle et non les promesses marketing." },
      { type: 'h2', text: 'Les codecs audio' },
      { type: 'list', items: ['SBC : Standard, compatible partout', 'AAC : Meilleure qualité sur Apple', 'aptX : Haute qualité sur Android', 'LDAC : Qualité Hi-Fi (Sony exclusif)'] },
      { type: 'h2', text: 'L\'autonomie réelle' },
      { type: 'p', text: "Méfiez-vous des chiffres marketing. L'autonomie réelle avec ANC activée est souvent 30% inférieure aux annonces. Cherchez des tests indépendants." },
      { type: 'h2', text: 'L\'étanchéité (IPX)' },
      { type: 'list', items: ['IPX4 : Résistant à la transpiration et aux éclaboussures', 'IPX5 : Résistant aux jets d\'eau', 'IPX7 : Submersible 30 min à 1m'] },
      { type: 'p', text: "Nos modèles SenTech Pro X1 combinent ANC performante, codec aptX, certification IPX5 et autonomie de 40h pour une expérience audio exceptionnelle à prix accessible." },
    ],
    image: '/earbuds.jpg',
    category: 'Guide d\'achat',
    date: '28 Juin 2026',
    author: 'Équipe SenTech',
    readTime: '6 min',
    tags: ['Écouteurs', 'Audio', 'Guide'],
  },
];

export function generateStaticParams() {
  return articles.map(a => ({ id: a.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const article = articles.find(a => a.id === params.id);
  if (!article) return {};
  return {
    title: `${article.title} | Blog SenTech Plus`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articles.find(a => a.id === params.id);
  if (!article) notFound();

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Back */}
        <Link href="/blog" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#475569', textDecoration: 'none', fontSize: '0.875rem',
          marginBottom: '32px', fontWeight: 500,
        }}>
          <ArrowLeft size={16} /> Retour au blog
        </Link>

        {/* Category + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span style={{
            background: 'rgba(27,117,188,0.1)', color: '#1b75bc',
            borderRadius: '100px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700,
            border: '1px solid rgba(27,117,188,0.2)',
          }}>
            {article.category}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.8rem' }}>
            <Calendar size={13} /> {article.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.8rem' }}>
            <Clock size={13} /> {article.readTime} de lecture
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800,
          color: 'var(--color-foreground)', lineHeight: 1.25,
          marginBottom: '24px', fontFamily: 'Outfit, sans-serif',
        }}>
          {article.title}
        </h1>

        {/* Hero image */}
        <div style={{ position: 'relative', height: '320px', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
          <Image src={article.image} alt={article.title} fill sizes="780px" style={{ objectFit: 'cover' }} />
        </div>

        {/* Author */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 20px', borderRadius: '12px', marginBottom: '40px',
          background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #1b75bc, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '1rem',
          }}>
            S
          </div>
          <div>
            <div style={{ color: 'var(--color-foreground)', fontWeight: 600, fontSize: '0.9rem' }}>{article.author}</div>
            <div style={{ color: '#475569', fontSize: '0.75rem' }}>SenTech Plus · Expert High-Tech</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ lineHeight: 1.85, color: '#334155' }}>
          {article.content.map((block, i) => {
            if (block.type === 'h2') return (
              <h2 key={i} style={{
                fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-foreground)',
                marginTop: '36px', marginBottom: '14px', fontFamily: 'Outfit, sans-serif',
                borderLeft: '3px solid #1b75bc', paddingLeft: '16px',
              }}>
                {block.text}
              </h2>
            );
            if (block.type === 'p') return (
              <p key={i} style={{ marginBottom: '18px', fontSize: '1rem', color: '#334155', lineHeight: 1.85 }}>
                {block.text}
              </p>
            );
            if (block.type === 'list' && block.items) return (
              <ul key={i} style={{ paddingLeft: '24px', marginBottom: '18px' }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: '8px', color: '#334155', fontSize: '0.95rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            );
            return null;
          })}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
          <Tag size={14} color="#475569" />
          {article.tags.map(tag => (
            <span key={tag} style={{
              padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600,
              background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
              color: '#475569',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '48px', padding: '32px', borderRadius: '16px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(27,117,188,0.08), rgba(37,99,235,0.06))',
          border: '1px solid rgba(27,117,188,0.2)',
        }}>
          <p style={{ color: 'var(--color-foreground)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
            Prêt à équiper votre setup ?
          </p>
          <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '20px' }}>
            Découvrez notre sélection de produits premium
          </p>
          <Link href="/boutique" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #1b75bc, #2563eb)',
            color: 'white', padding: '12px 24px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
            boxShadow: '0 4px 16px rgba(27,117,188,0.35)',
          }}>
            Voir la boutique →
          </Link>
        </div>

        {/* Nav articles */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--color-sentech-border)' }}>
          <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Articles similaires
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {articles.filter(a => a.id !== article.id).map(other => (
              <Link key={other.id} href={`/blog/${other.id}`} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: '12px', textDecoration: 'none',
                background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={other.image} alt={other.title} fill sizes="60px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#1b75bc', fontWeight: 600, marginBottom: '3px' }}>{other.category}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-foreground)', lineHeight: 1.3 }}>{other.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
