'use client';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getStrength(password);

  const getColor = (s: number) => {
    switch (s) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
      case 3:
        return 'bg-amber-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getLabel = (s: number) => {
    switch (s) {
      case 0:
        return '';
      case 1:
        return 'Très faible';
      case 2:
        return 'Faible';
      case 3:
        return 'Moyen';
      case 4:
        return 'Fort';
      case 5:
        return 'Très fort';
      default:
        return '';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 transition-all duration-300 ${
              level <= strength ? getColor(strength) : 'bg-transparent'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Force du mot de passe</span>
        <span className="font-medium">{getLabel(strength)}</span>
      </div>
    </div>
  );
}
