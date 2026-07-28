import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { LogoutButton } from '@/components/auth/LogoutButton';

export const metadata: Metadata = {
  title: 'Mon Profil - SenTech Plus',
  description: 'Gérez vos informations de profil et vos paramètres de sécurité.',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Paramètres du Compte</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Gérez votre profil, votre sécurité et vos préférences</p>
          </div>
          <LogoutButton />
        </div>

        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}
