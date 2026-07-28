import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion - SenTech Plus',
  description: 'Connectez-vous à votre espace utilisateur ou vendeur SenTech Plus.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-slate-900/60">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">SenTech Plus</h1>
          <p className="text-sm text-slate-300">Bienvenue ! Connectez-vous à votre compte</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
