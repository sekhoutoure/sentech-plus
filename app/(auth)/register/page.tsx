import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Inscription - SenTech Plus',
  description: 'Rejoignez la marketplace SaaS SenTech Plus en tant qu acheteur ou vendeur.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-slate-900/60">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">SenTech Plus</h1>
          <p className="text-sm text-slate-300">Créez votre compte en quelques secondes</p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm text-slate-400">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
