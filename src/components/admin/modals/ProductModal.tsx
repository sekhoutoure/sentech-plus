'use client';

import Image from 'next/image';
import { X, Upload, CheckSquare, Square } from 'lucide-react';
import { Product, Category } from '@/lib/products';

interface ProductModalProps {
  editingProduct: Product | null;
  onClose: () => void;
  onSaveProduct: (e: React.FormEvent) => void;
  prodName: string;
  setProdName: (v: string) => void;
  prodCategory: Category;
  setProdCategory: (v: Category) => void;
  prodBrand: string;
  setProdBrand: (v: string) => void;
  prodPrice: string;
  setProdPrice: (v: string) => void;
  prodStock: string;
  setProdStock: (v: string) => void;
  prodImage: string;
  setProdImage: (v: string) => void;
  prodCustomUrl: string;
  setProdCustomUrl: (v: string) => void;
  prodDescription: string;
  setProdDescription: (v: string) => void;
  prodFeatures: string;
  setProdFeatures: (v: string) => void;
  prodIsNew: boolean;
  setProdIsNew: React.Dispatch<React.SetStateAction<boolean>>;
  prodIsBestSeller: boolean;
  setProdIsBestSeller: React.Dispatch<React.SetStateAction<boolean>>;
  prodIsPromo: boolean;
  setProdIsPromo: React.Dispatch<React.SetStateAction<boolean>>;
  handleImageFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProductModal({
  editingProduct,
  onClose,
  onSaveProduct,
  prodName,
  setProdName,
  prodCategory,
  setProdCategory,
  prodBrand,
  setProdBrand,
  prodPrice,
  setProdPrice,
  prodStock,
  setProdStock,
  prodImage,
  setProdImage,
  prodCustomUrl,
  setProdCustomUrl,
  prodDescription,
  setProdDescription,
  prodFeatures,
  setProdFeatures,
  prodIsNew,
  setProdIsNew,
  prodIsBestSeller,
  setProdIsBestSeller,
  prodIsPromo,
  setProdIsPromo,
  handleImageFileUpload,
}: ProductModalProps) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
            {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit au Catalogue'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-sentech-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* SECTION 1: INFOS GÉNÉRALES */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Informations Générales</div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Nom du produit *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Chargeur GaN 100W Ultra-Rapide"
                value={prodName}
                onChange={e => setProdName(e.target.value)}
                className="sentech-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Catégorie *
                </label>
                <select
                  value={prodCategory}
                  onChange={e => setProdCategory(e.target.value as Category)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px',
                    border: '1px solid var(--color-sentech-border)',
                    background: 'var(--color-sentech-card)', color: 'var(--color-foreground)',
                    fontSize: '0.875rem', fontWeight: 500,
                  }}
                >
                  <option value="Chargeurs Rapides">⚡ Chargeurs Rapides</option>
                  <option value="Câbles Premium">🔌 Câbles Premium</option>
                  <option value="Supports Téléphone">📱 Supports Téléphone</option>
                  <option value="Écouteurs Bluetooth">🎧 Écouteurs Bluetooth</option>
                  <option value="Casques Audio">🎵 Casques Audio</option>
                  <option value="Montres Connectées">⌚ Montres Connectées</option>
                  <option value="Batteries Externes">🔋 Batteries Externes</option>
                  <option value="Accessoires PC">💻 Accessoires PC</option>
                  <option value="Gaming">🎮 Gaming</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Marque
                </label>
                <input
                  type="text"
                  placeholder="Ex: SenTech, Anker, Apple"
                  value={prodBrand}
                  onChange={e => setProdBrand(e.target.value)}
                  className="sentech-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="19900"
                  value={prodPrice}
                  onChange={e => setProdPrice(e.target.value)}
                  className="sentech-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Quantité en Stock
                </label>
                <input
                  type="number"
                  value={prodStock}
                  onChange={e => setProdStock(e.target.value)}
                  className="sentech-input"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: IMPORTATION & CHOIX D'IMAGE */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Importation & Image du Produit</div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '12px',
                background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                overflow: 'hidden', position: 'relative', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Image
                  src={prodCustomUrl.trim() ? prodCustomUrl.trim() : prodImage}
                  alt="Aperçu du produit"
                  fill
                  sizes="70px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', borderRadius: '100px', background: 'rgba(27,117,188,0.1)',
                  color: '#1b75bc', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  border: '1px solid rgba(27,117,188,0.2)', width: 'fit-content',
                }}>
                  <Upload size={15} /> Importer depuis votre ordinateur
                  <input type="file" accept="image/*" onChange={handleImageFileUpload} style={{ display: 'none' }} />
                </label>
                <span style={{ fontSize: '0.75rem', color: '#475569' }}>Formats acceptés: JPG, PNG, WebP</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Ou saisir l&apos;URL personnalisée de l&apos;image :
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={prodCustomUrl}
                onChange={e => setProdCustomUrl(e.target.value)}
                className="sentech-input"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Ou choisir dans la banque d&apos;images par défaut :
              </label>
              <select
                value={prodImage}
                onChange={e => { setProdImage(e.target.value); setProdCustomUrl(''); }}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  border: '1px solid var(--color-sentech-border)',
                  background: 'var(--color-sentech-card)', color: 'var(--color-foreground)',
                  fontSize: '0.875rem', fontWeight: 500,
                }}
              >
                <option value="/charger.jpg">🔌 Chargeur Rapide GaN</option>
                <option value="/earbuds.jpg">🎧 Écouteurs TWS Bluetooth</option>
                <option value="/smartwatch.jpg">⌚ Montre Connectée Pro</option>
                <option value="/powerbank.jpg">🔋 Power Bank 20000mAh</option>
                <option value="/headphones.jpg">🎵 Casque Audio NC</option>
                <option value="/stand.jpg">📱 Support Téléphone MagSafe</option>
              </select>
            </div>
          </div>

          {/* SECTION 3: DESCRIPTION & SPÉCIFICATIONS */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>3. Description & Spécifications</div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Description complète du produit
              </label>
              <textarea
                rows={3}
                placeholder="Description détaillée du produit et avantages..."
                value={prodDescription}
                onChange={e => setProdDescription(e.target.value)}
                className="sentech-input"
                style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Caractéristiques clés (séparées par une virgule)
              </label>
              <input
                type="text"
                placeholder="Garantie 12 mois, Livraison 24h, Puce intelligente"
                value={prodFeatures}
                onChange={e => setProdFeatures(e.target.value)}
                className="sentech-input"
                style={{ fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* SECTION 4: BADGES DE MISE EN AVANT */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>4. Badges & Classement de Mise en Avant</div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setProdIsNew(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: prodIsNew ? 'rgba(27,117,188,0.12)' : 'var(--color-sentech-card)',
                  border: prodIsNew ? '1px solid #1b75bc' : '1px solid var(--color-sentech-border)',
                  color: prodIsNew ? '#1b75bc' : 'var(--color-sentech-muted)',
                  fontSize: '0.82rem', fontWeight: 600,
                }}
              >
                {prodIsNew ? <CheckSquare size={16} color="#1b75bc" /> : <Square size={16} />}
                ✨ Nouveauté
              </button>

              <button
                type="button"
                onClick={() => setProdIsBestSeller(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: prodIsBestSeller ? 'rgba(245,158,11,0.12)' : 'var(--color-sentech-card)',
                  border: prodIsBestSeller ? '1px solid #f59e0b' : '1px solid var(--color-sentech-border)',
                  color: prodIsBestSeller ? '#f59e0b' : 'var(--color-sentech-muted)',
                  fontSize: '0.82rem', fontWeight: 600,
                }}
              >
                {prodIsBestSeller ? <CheckSquare size={16} color="#f59e0b" /> : <Square size={16} />}
                🔥 Meilleure Vente
              </button>

              <button
                type="button"
                onClick={() => setProdIsPromo(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: prodIsPromo ? 'rgba(239,68,68,0.12)' : 'var(--color-sentech-card)',
                  border: prodIsPromo ? '1px solid #ef4444' : '1px solid var(--color-sentech-border)',
                  color: prodIsPromo ? '#ef4444' : 'var(--color-sentech-muted)',
                  fontSize: '0.82rem', fontWeight: 600,
                }}
              >
                {prodIsPromo ? <CheckSquare size={16} color="#ef4444" /> : <Square size={16} />}
                🏷️ En Promotion
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
            >
              Enregistrer le Produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
