import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Guard для проверки ролей пользователя
 * Используется в маршрутах с data: { roles: ['role1', 'role2'] }
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Проверка аутентификации
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Получаем разрешенные роли из данных маршрута
  const allowedRoles = route.data['roles'] as UserRole[];
  
  if (!allowedRoles || allowedRoles.length === 0) {
    // Если роли не указаны, разрешаем доступ всем аутентифицированным
    return true;
  }

  // Проверяем роль текущего пользователя
  const userRole = authService.getRole();
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    // Перенаправляем на страницу по умолчанию для роли пользователя
    redirectByRole(userRole, router);
    return false;
  }

  return true;
};

/**
 * Перенаправление пользователя на страницу по умолчанию для его роли
 */
function redirectByRole(role: UserRole | null, router: Router): void {
  const roleRoutes: Record<UserRole, string> = {
    'hr-manager': '/app/receipts',
    'economist': '/app/analytics',
    'director': '/app/reports',
    'admin': '/app/admin/users'
  };

  if (role && roleRoutes[role]) {
    router.navigate([roleRoutes[role]]);
  } else {
    router.navigate(['/auth/login']);
  }
}

