import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../core/models/user.model';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Проверка роли, если указана в данных маршрута
  const allowedRoles = route.data['roles'] as UserRole[];
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = authService.getRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Перенаправление в зависимости от роли пользователя
      const userRole = authService.getRole();
      if (userRole === 'hr-manager') {
        router.navigate(['/hr/receipts']);
      } else if (userRole === 'economist') {
        router.navigate(['/economist/analytics']);
      } else if (userRole === 'director') {
        router.navigate(['/director/reports']);
      } else if (userRole === 'admin') {
        router.navigate(['/admin/users']);
      } else {
        router.navigate(['/auth/login']);
      }
      return false;
    }
  }

  return true;
};

