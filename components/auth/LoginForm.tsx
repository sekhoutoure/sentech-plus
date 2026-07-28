'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, Store, ShoppingBag } from 'lucide-react';
import { loginSchema, LoginInput } from '@/validators/authValidators';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { SocialLogin } from './SocialLogin';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/features/user/userSlice';
import { trackUserLogin } from '@/lib/analytics';

type UserRole = 'user' | 'seller' | 'admin';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success && result.data) {
        dispatch(login(result.data));
        trackUserLogin(result.data.role || selectedRole);
        toast.success(`Bienvenue ${result.data.name || ''} ! Connexion réussie.`);

        const userRole = result.data.role || selectedRole;
        if (userRole === 'admin') {
          router.push('/admin');
        } else if (userRole === 'seller') {
          router.push('/store');
        } else {
          router.push('/profile');
        }
        router.refresh();
      } else {
        toast.error(result.message || 'Identifiants incorrects');
      }
    } catch (err) {
      toast.error('Erreur de connexion au serveur d\'authentification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Role selector tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
          Espace de connexion
        </label>
        <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-1 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition text-xs font-bold cursor-pointer ${
              selectedRole === 'user'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Acheteur</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('seller')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition text-xs font-bold cursor-pointer ${
              selectedRole === 'seller'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>Vendeur</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition text-xs font-bold cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <Input
        label="Adresse email"
        type="email"
        placeholder="nom@exemple.sn"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="space-y-1">
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
        <div className="flex items-center justify-between pt-1">
          <Checkbox label="Se souvenir de moi" {...register('rememberMe')} />
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      <Button type="submit" isLoading={loading} icon={<LogIn className="h-4 w-4" />}>
        Se connecter ({selectedRole === 'admin' ? 'Admin' : selectedRole === 'seller' ? 'Vendeur' : 'Acheteur'})
      </Button>

      <SocialLogin />

      <div className="text-center text-xs text-slate-400 pt-2">
        Vous n'avez pas encore de compte ?{' '}
        <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
          Créer un compte
        </Link>
      </div>
    </form>
  );
};
