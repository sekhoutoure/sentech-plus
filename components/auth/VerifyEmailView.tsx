'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { OTPInput } from './ui/OTPInput';
import { Button } from './ui/Button';

export const VerifyEmailView: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const router = useRouter();

  const verifyToken = async (tok: string) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tok }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Votre email a été vérifié avec succès !');
        toast.success('Compte activé !');
      } else {
        setStatus('error');
        setMessage(data.message || 'Jeton de vérification invalide ou expiré.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Une erreur réseau est survenue.');
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-email', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Un nouvel email de confirmation vous a été envoyé.');
      } else {
        toast.error(data.message || 'Erreur lors du renvoi');
      }
    } catch (err) {
      toast.error('Erreur réseau');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="text-center space-y-6 py-2">
      {status === 'loading' && (
        <div className="space-y-4">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Vérification de votre compte en cours...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Email Vérifié !</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{message}</p>
          <Link href="/auth/login">
            <Button variant="primary">Se connecter à mon espace</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
            <XCircle className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Échec de vérification</h3>
          <p className="text-xs text-red-500">{message}</p>
          <Button variant="outline" onClick={handleResend} isLoading={resending} icon={<RefreshCw className="h-4 w-4" />}>
            Renvoyer l email de confirmation
          </Button>
        </div>
      )}

      {status === 'idle' && !token && (
        <div className="space-y-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Saisissez le code de vérification à 6 chiffres reçu par email :
          </p>
          <OTPInput onComplete={(code) => verifyToken(code)} />
          <div className="pt-2">
            <Button variant="outline" onClick={handleResend} isLoading={resending} icon={<RefreshCw className="h-4 w-4" />}>
              Renvoyer le code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
