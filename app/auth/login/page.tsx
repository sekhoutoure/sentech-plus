import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion - SenTech Plus',
  description: 'Connectez-vous à votre espace utilisateur ou vendeur SenTech Plus.',
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenue à nouveau"
      subtitle="Accédez à votre espace sécurisé SenTech Plus"
    >
      <LoginForm />
    </AuthLayout>
  );
}
