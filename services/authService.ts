import bcrypt from 'bcryptjs';
import { UserRepository } from '@/repositories/userRepository';
import { TokenRepository } from '@/repositories/tokenRepository';
import { generateVerificationToken, generatePasswordResetToken } from '@/lib/tokens';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/mail';
import { RegisterInput, ResetPasswordInput, ChangePasswordInput } from '@/validators/authValidators';

export class AuthService {
  static async register(input: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
    role?: any;
  }) {
    const fullName = input.name || `${input.firstName || ''} ${input.lastName || ''}`.trim();
    const existingUser = await UserRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('Un compte avec cette adresse email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await UserRepository.create({
      name: fullName,
      email: input.email,
      password: hashedPassword,
      role: input.role,
    });

    const verificationToken = await generateVerificationToken(user.email);
    await sendVerificationEmail(user.email, verificationToken.token);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static async verifyEmail(token: string) {
    const existingToken = await TokenRepository.findVerificationTokenByToken(token);
    if (!existingToken) {
      throw new Error('Jeton de vérification invalide ou inexistant.');
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      throw new Error('Le jeton de vérification a expiré.');
    }

    const existingUser = await UserRepository.findByEmail(existingToken.email);
    if (!existingUser) {
      throw new Error("L'utilisateur associé à ce jeton n'existe pas.");
    }

    await UserRepository.update(existingUser.id, {
      emailVerified: new Date(),
    });

    await TokenRepository.deleteVerificationToken(existingToken.id);

    return true;
  }

  static async resendVerificationEmail(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Return true to prevent email enumeration
      return true;
    }

    if (user.emailVerified) {
      throw new Error('Votre adresse email est déjà vérifiée.');
    }

    const verificationToken = await generateVerificationToken(user.email);
    await sendVerificationEmail(user.email, verificationToken.token);

    return true;
  }

  static async forgotPassword(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Silent exit to prevent user enumeration
      return true;
    }

    const resetToken = await generatePasswordResetToken(user.email);
    await sendPasswordResetEmail(user.email, resetToken.token);

    return true;
  }

  static async resetPassword(input: ResetPasswordInput) {
    const existingToken = await TokenRepository.findPasswordResetTokenByToken(input.token);
    if (!existingToken) {
      throw new Error('Jeton de réinitialisation invalide.');
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      throw new Error('Le jeton de réinitialisation a expiré.');
    }

    const user = await UserRepository.findByEmail(existingToken.email);
    if (!user) {
      throw new Error("L'utilisateur n'existe plus.");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    await UserRepository.update(user.id, {
      password: hashedPassword,
    });

    await TokenRepository.deletePasswordResetToken(existingToken.id);

    return true;
  }

  static async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await UserRepository.findById(userId);
    if (!user || !user.password) {
      throw new Error('Utilisateur non trouvé.');
    }

    const passwordsMatch = await bcrypt.compare(input.currentPassword, user.password);
    if (!passwordsMatch) {
      throw new Error('Le mot de passe actuel est incorrect.');
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 12);

    await UserRepository.update(userId, {
      password: hashedPassword,
    });

    return true;
  }
}
