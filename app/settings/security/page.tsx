import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ProfileForm } from '@/components/auth/ProfileForm';

export const metadata: Metadata = {
  title: 'Paramètres de Sécurité - SenTech Plus',
  description: 'Gérez la sécurité de votre compte, modifiez votre mot de passe et vos accès.',
};

export default async function SecuritySettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Sécurité & Authentification</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Gérez vos informations d accès, modifiez votre mot de passe et contrôlez la sécurité de votre compte.
          </p>
        </div>

        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}
