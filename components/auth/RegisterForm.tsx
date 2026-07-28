'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, ShoppingBag, Store } from 'lucide-react';
import { registerSchema, RegisterInput } from '@/validators/authValidators';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { PasswordStrength } from './PasswordStrength';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '+221',
      password: '',
      confirmPassword: '',
      role: 'user',
      terms: true,
    },
  });

  const password = watch('password', '');
  const selectedRole = watch('role', 'user');
  const strength = usePasswordStrength(password);

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message || 'Compte créé avec succès !');
        router.push('/auth/email-sent');
      } else {
        toast.error(result.message || 'Erreur lors de l inscription');
      }
    } catch (err) {
      toast.error('Erreur réseau lors de l inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role Selection */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Je souhaite m inscrire en tant que
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('role', 'user')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
              selectedRole === 'user'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Acheteur
          </button>
          <button
            type="button"
            onClick={() => setValue('role', 'seller')}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
              selectedRole === 'seller'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Store className="h-4 w-4" /> Vendeur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Prénom"
          placeholder="Mamadou"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Nom"
          placeholder="Diallo"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <Input
        label="Adresse email"
        type="email"
        placeholder="m.diallo@exemple.sn"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Téléphone (+221)"
        placeholder="+221770000000"
        leftIcon={<Phone className="h-4 w-4" />}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div>
        <Input
          label="Mot de passe"
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
        label="Confirmer le mot de passe"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Checkbox
        label={
          <span>
            J accepte les{' '}
            <Link href="/terms" className="text-indigo-600 hover:underline dark:text-indigo-400">
              Conditions Générales d Utilisation
            </Link>
          </span>
        }
        error={errors.terms?.message}
        {...register('terms')}
      />

      <Button type="submit" isLoading={loading} icon={<UserPlus className="h-4 w-4" />}>
        Créer mon compte
      </Button>

      <div className="text-center text-xs text-slate-400 pt-2">
        Vous avez déjà un compte ?{' '}
        <Link href="/login" className="font-semibold text-indigo-400 hover:underline">
          Se connecter
        </Link>
      </div>
    </form>
  );
};
