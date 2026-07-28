import { UserRole } from '@/types/auth';

export const ROLE_PERMISSIONS = {
  user: [
    'view_products',
    'create_order',
    'view_own_orders',
    'manage_own_profile',
    'leave_review',
  ],
  seller: [
    'view_products',
    'create_order',
    'view_own_orders',
    'manage_own_profile',
    'leave_review',
    'manage_store',
    'create_product',
    'edit_product',
    'delete_product',
    'view_seller_analytics',
  ],
  admin: [
    'view_products',
    'create_order',
    'view_own_orders',
    'manage_own_profile',
    'leave_review',
    'manage_store',
    'create_product',
    'edit_product',
    'delete_product',
    'view_seller_analytics',
    'manage_all_users',
    'manage_all_stores',
    'manage_all_orders',
    'view_admin_dashboard',
    'manage_platform_settings',
  ],
} as const;

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return (permissions as readonly string[]).includes(permission);
}

export function getDefaultDashboard(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'seller':
      return '/seller';
    case 'user':
    default:
      return '/user';
  }
}
