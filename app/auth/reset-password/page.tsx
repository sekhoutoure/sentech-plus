import { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Nouveau mot de passe - SenTech Plus',
  description: 'Choisissez votre nouveau mot de passe SenTech Plus.',
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe fort et sécurisé"
    >
      <Suspense fallback={<div className="text-center text-slate-500">Chargement...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
