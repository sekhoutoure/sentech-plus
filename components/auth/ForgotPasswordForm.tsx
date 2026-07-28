'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/validators/authValidators';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const ForgotPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setSubmittedEmail(data.email);
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Erreur lors de la demande');
      }
    } catch (err) {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  if (submittedEmail) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email envoyé !</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Si un compte correspond à <strong className="text-slate-800 dark:text-slate-200">{submittedEmail}</strong>, vous
          recevrez un lien de réinitialisation sous peu.
        </p>
        <Link href="/auth/login" className="inline-block pt-2 text-xs font-semibold text-indigo-600 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Adresse email"
        type="email"
        placeholder="nom@exemple.com"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Button type="submit" isLoading={loading} icon={<ArrowRight className="h-4 w-4" />}>
        Envoyer le lien
      </Button>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        <Link href="/auth/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
};
