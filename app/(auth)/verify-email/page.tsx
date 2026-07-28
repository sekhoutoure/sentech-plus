import { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmailView } from '@/components/auth/VerifyEmailView';

export const metadata: Metadata = {
  title: 'Vérification de l email - SenTech Plus',
  description: 'Vérifiez votre adresse email pour activer votre compte SenTech Plus.',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-slate-900/60">
        <Suspense fallback={<div className="text-center text-white">Chargement...</div>}>
          <VerifyEmailView />
        </Suspense>
      </div>
    </div>
  );
}
