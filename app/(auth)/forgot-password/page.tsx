import { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Mot de passe oublié - SenTech Plus',
  description: 'Réinitialisez le mot de passe de votre compte SenTech Plus.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-slate-900/60">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">SenTech Plus</h1>
          <p className="text-sm text-slate-300">Entrez votre email pour réinitialiser votre mot de passe</p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center text-sm text-slate-400">
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
