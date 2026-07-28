import { prisma } from '@/lib/prisma';

export class TokenRepository {
  static async findVerificationTokenByToken(token: string) {
    return prisma.verificationToken.findUnique({
      where: { token },
    });
  }

  static async findVerificationTokenByEmail(email: string) {
    return prisma.verificationToken.findFirst({
      where: { email: email.toLowerCase().trim() },
    });
  }

  static async deleteVerificationToken(id: string) {
    return prisma.verificationToken.delete({
      where: { id },
    });
  }

  static async findPasswordResetTokenByToken(token: string) {
    return prisma.passwordResetToken.findUnique({
      where: { token },
    });
  }

  static async findPasswordResetTokenByEmail(email: string) {
    return prisma.passwordResetToken.findFirst({
      where: { email: email.toLowerCase().trim() },
    });
  }

  static async deletePasswordResetToken(id: string) {
    return prisma.passwordResetToken.delete({
      where: { id },
    });
  }
}
