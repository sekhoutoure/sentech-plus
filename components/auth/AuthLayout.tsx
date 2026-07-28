'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '../Logo';
import { AuthCard } from './AuthCard';
import { AuthIllustration } from './AuthIllustration';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[680px]">
        {/* Left Form Section */}
        <div className="flex flex-col justify-center items-center w-full">
          <AuthCard>
            <div className="text-center space-y-3 mb-6">
              <Link href="/" className="inline-block transition-transform hover:scale-105">
                <Logo />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            {children}
          </AuthCard>
        </div>

        {/* Right Illustration Section */}
        <div className="hidden lg:block h-full">
          <AuthIllustration />
        </div>
      </div>
    </div>
  );
};
