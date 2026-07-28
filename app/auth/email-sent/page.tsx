import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/auth/ui/Button';

export const metadata: Metadata = {
  title: 'Email envoyé - SenTech Plus',
  description: 'Un email de vérification vous a été envoyé.',
};

export default function EmailSentPage() {
  return (
    <AuthLayout
      title="Vérifiez votre boîte mail"
      subtitle="Un lien de confirmation vous a été envoyé"
    >
      <div className="text-center space-y-6 py-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Mail className="h-8 w-8" />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Merci de vous être inscrit sur SenTech Plus ! Nous venons de vous envoyer un email contenant un lien pour valider votre compte.
        </p>

        <div className="pt-2 space-y-3">
          <Link href="/auth/login">
            <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
              Retour à la connexion
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
