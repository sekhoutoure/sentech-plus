import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.').max(100),
  email: z.string().email('Adresse e-mail invalide.').toLowerCase(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
  role: z.enum(['user', 'seller', 'admin'], { message: 'Rôle sélectionné invalide.' }),
})

export const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide.').toLowerCase(),
  password: z.string().min(1, 'Le mot de passe est obligatoire.'),
})

export const storeSchema = z.object({
  name: z.string().min(3, 'Le nom de la boutique doit contenir au moins 3 caractères.'),
  username: z.string().min(3, 'L’identifiant URL doit contenir au moins 3 caractères.').regex(/^[a-z0-9-]+$/, 'Seuls les lettres minuscules, chiffres et tirets sont autorisés.'),
  description: z.string().min(10, 'La description doit faire au moins 10 caractères.'),
  email: z.string().email('E-mail professionnel invalide.'),
  contact: z.string().min(8, 'Numéro de téléphone invalide.'),
  address: z.string().min(5, 'Adresse invalide.'),
})

export const productSchema = z.object({
  name: z.string().min(3, 'Le nom du produit est trop court.'),
  description: z.string().min(10, 'La description doit faire au moins 10 caractères.'),
  price: z.number().positive('Le prix doit être un nombre positif.'),
  mrp: z.number().optional(),
  category: z.string().min(2, 'Veuillez sélectionner une catégorie.'),
})

export const addressSchema = z.object({
  name: z.string().min(2, 'Nom du destinataire invalide.'),
  email: z.string().email('E-mail invalide.'),
  street: z.string().min(5, 'Adresse / Quartier obligatoire.'),
  city: z.string().min(2, 'Ville obligatoire.'),
  state: z.string().min(2, 'Région obligatoire.'),
  country: z.string().min(2, 'Pays obligatoire.'),
  phone: z.string().min(8, 'Téléphone de livraison obligatoire.'),
})
