import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(100, 'Le mot de passe est trop long')
  .regex(/[A-Z]/, 'Au moins une lettre majuscule est requise')
  .regex(/[a-z]/, 'Au moins une lettre minuscule est requise')
  .regex(/[0-9]/, 'Au moins un chiffre est requis')
  .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial est requis');


export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50).trim(),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50).trim(),
    email: z.string().email('Adresse email invalide').toLowerCase().trim(),
    phone: z
      .string()
      .regex(/^(\+221|221)?[7638][0-9]{8}$/, 'Numéro de téléphone Sénégal invalide (ex: +221770000000)'),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(['user', 'seller']),
    terms: z.boolean().refine((val) => val === true, 'Vous devez accepter les conditions générales d utilisation'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide').toLowerCase().trim(),
  password: z.string().min(1, 'Le mot de passe est obligatoire'),
  rememberMe: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide').toLowerCase().trim(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Jeton invalide'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Code de vérification requis'),
});

export const resendVerificationSchema = z.object({
  email: z.string().email('Adresse email invalide').toLowerCase().trim(),
});

export const resendEmailSchema = resendVerificationSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
