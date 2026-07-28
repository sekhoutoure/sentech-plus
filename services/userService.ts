import { UserRepository } from '@/repositories/userRepository';

export class UserService {
  static async getUserProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('Utilisateur non trouvé.');
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }

  static async updateProfile(userId: string, data: { name?: string; image?: string }) {
    const updated = await UserRepository.update(userId, data);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      image: updated.image,
      role: updated.role,
    };
  }

  static async deleteAccount(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('Utilisateur non trouvé.');
    await UserRepository.delete(userId);
    return true;
  }
}
