import { useMemo } from 'react';
import { PasswordStrengthResult } from '@/types/auth';

export function usePasswordStrength(password: string): PasswordStrengthResult {
  return useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecialChar) score += 1;

    let label = 'Très faible';
    let color = 'bg-red-500';

    switch (score) {
      case 0:
      case 1:
        label = 'Très faible';
        color = 'bg-red-500';
        break;
      case 2:
        label = 'Faible';
        color = 'bg-orange-500';
        break;
      case 3:
        label = 'Moyen';
        color = 'bg-amber-500';
        break;
      case 4:
        label = 'Fort';
        color = 'bg-blue-500';
        break;
      case 5:
        label = 'Très fort';
        color = 'bg-emerald-500';
        break;
    }

    return {
      score,
      label,
      color,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    };
  }, [password]);
}
