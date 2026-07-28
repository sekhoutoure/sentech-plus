import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Créer un compte - SenTech Plus',
  description: 'Inscrivez-vous sur la marketplace SaaS SenTech Plus en tant qu acheteur ou vendeur.',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez des milliers de commerçants et d acheteurs"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
