'use client';

import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  deleteConfirm: { id: string; name: string } | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export default function DeleteConfirmModal({
  deleteConfirm,
  onClose,
  onConfirmDelete,
}: DeleteConfirmModalProps) {
  if (!deleteConfirm) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px',
    }}>
      <div style={{
        background: 'var(--color-sentech-card)', borderRadius: '24px', width: '100%', maxWidth: '400px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)', border: '1px solid var(--color-sentech-border)',
        padding: '32px', textAlign: 'center',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ef4444', fontSize: '24px', margin: '0 auto 20px',
        }}>
          <AlertTriangle size={28} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '12px' }}>
          Confirmer la suppression
        </h3>
        <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.5 }}>
          Voulez-vous vraiment supprimer le produit <strong>&quot;{deleteConfirm.name}&quot;</strong> ? Cette action est irréversible.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            className="btn-primary"
            style={{ flex: 1, padding: '14px', justifyContent: 'center', background: '#ef4444', borderColor: '#ef4444', color: 'white' }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
