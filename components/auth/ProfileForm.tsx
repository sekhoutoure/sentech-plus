'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Lock, User, Trash2 } from 'lucide-react';

interface ProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    image?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error(data.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      toast.error('Erreur réseau');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.')) {
      return;
    }

    setLoadingDelete(true);
    try {
      const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Compte supprimé');
        window.location.href = '/login';
      } else {
        toast.error(data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      toast.error('Erreur réseau');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Information Générale */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Informations du Profil</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nom complet</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-10 pr-4 py-3 text-sm text-slate-900 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email (non modifiable)</label>
            <input
              type="email"
              disabled
              value={user.email || ''}
              className="mt-1 w-full rounded-xl border border-slate-200/50 bg-slate-100/50 px-4 py-3 text-sm text-slate-500 cursor-not-allowed dark:border-slate-800/50 dark:bg-slate-800/40 dark:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Rôle</label>
            <span className="inline-block mt-1 uppercase font-bold text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md dark:bg-indigo-950 dark:text-indigo-300">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Changement de Mot de Passe */}
      <form onSubmit={handlePasswordChange} className="rounded-2xl border border-slate-200/80 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Changer le mot de passe</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mot de passe actuel</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-10 pr-10 py-3 text-sm text-slate-900 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nouveau mot de passe</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-10 pr-10 py-3 text-sm text-slate-900 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingPassword}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loadingPassword ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Mettre à jour le mot de passe'}
        </button>
      </form>

      {/* Suppression du compte */}
      <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-6 backdrop-blur-xl dark:border-red-900/50 dark:bg-red-950/20 shadow-sm space-y-3">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Zone dangereuse</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          La suppression de votre compte effacera toutes vos données personnelles de SenTech Plus.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={loadingDelete}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition-all disabled:opacity-50"
        >
          {loadingDelete ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Supprimer définitivement le compte
        </button>
      </div>
    </div>
  );
}
