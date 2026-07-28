import { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { VerifyEmailView } from '@/components/auth/VerifyEmailView';

export const metadata: Metadata = {
  title: 'Vérification email - SenTech Plus',
  description: 'Vérifiez votre adresse email pour activer votre compte SenTech Plus.',
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Vérification de l email"
      subtitle="Validez votre adresse email pour sécuriser votre compte"
    >
      <Suspense fallback={<div className="text-center text-slate-500">Chargement...</div>}>
        <VerifyEmailView />
      </Suspense>
    </AuthLayout>
  );
}
