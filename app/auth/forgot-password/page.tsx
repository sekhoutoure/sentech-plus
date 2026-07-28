import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Mot de passe oublié - SenTech Plus',
  description: 'Réinitialisez votre mot de passe SenTech Plus en toute sécurité.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Mot de passe oublié ?"
      subtitle="Entrez votre email pour recevoir des instructions de réinitialisation"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
