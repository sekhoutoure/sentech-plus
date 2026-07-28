import { prisma } from '@/lib/prisma';
import { UserRole } from '@/types/auth';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async create(data: {
    name: string;
    email: string;
    password?: string;
    role?: UserRole;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: data.password,
        role: data.role || 'user',
      },
    });
  }

  static async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      password?: string;
      role: UserRole;
      emailVerified: Date | null;
      image: string | null;
    }>
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
