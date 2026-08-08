/**
 * Utilitaires de Sécurité (TypeScript)
 * Méthodes génériques pour valider et nettoyer les entrées utilisateur côté API.
 */

/**
 * Nettoie une chaîne de caractères pour éviter l'injection HTML simple.
 */
export const sanitizeInput = (str: unknown): string => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Valide qu'un email correspond à un format standard.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide la force d'un mot de passe (min 8 caractères).
 */
export const isStrongPassword = (password: string): boolean => {
  return typeof password === 'string' && password.length >= 8;
};

/**
 * Filtre un objet de requête pour n'autoriser que certains champs.
 * Empêche l'Over-Posting (Mass Assignment).
 */
export const filterAllowedFields = (
  body: unknown,
  allowedFields: string[]
): any => {
  if (!body || typeof body !== 'object') return {};

  const record = body as Record<string, any>;
  const cleanObj: Record<string, any> = {};

  for (const key of Object.keys(record)) {
    if (allowedFields.includes(key)) {
      const val = record[key];
      cleanObj[key] = typeof val === 'string' ? sanitizeInput(val) : val;
    }
  }

  return cleanObj;
};
