'use client';

import React from 'react';
import { PasswordStrengthResult } from '@/types/auth';

interface PasswordStrengthProps {
  strength: PasswordStrengthResult;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ strength }) => {
  if (strength.score === 0) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              level <= strength.score ? strength.color : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">Sécurité :</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{strength.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <div className={strength.hasMinLength ? 'text-emerald-500 font-medium' : ''}>
          ✓ 8 caractères min.
        </div>
        <div className={strength.hasUppercase ? 'text-emerald-500 font-medium' : ''}>
          ✓ Majuscule
        </div>
        <div className={strength.hasNumber ? 'text-emerald-500 font-medium' : ''}>
          ✓ Chiffre
        </div>
        <div className={strength.hasSpecialChar ? 'text-emerald-500 font-medium' : ''}>
          ✓ Caractère spécial
        </div>
      </div>
    </div>
  );
};
