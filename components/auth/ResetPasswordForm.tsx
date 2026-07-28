'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordInput } from '@/validators/authValidators';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PasswordStrength } from './PasswordStrength';

export const ResetPasswordForm: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password', '');
  const strength = usePasswordStrength(password);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error('Jeton de réinitialisation manquant');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message || 'Mot de passe réinitialisé !');
        router.push('/auth/login');
      } else {
        toast.error(result.message || 'Erreur lors de la réinitialisation');
      }
    } catch (err) {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Nouveau mot de passe"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrength strength={strength} />
      </div>

      <Input
        label="Confirmer le nouveau mot de passe"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" isLoading={loading} icon={<KeyRound className="h-4 w-4" />}>
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
};
