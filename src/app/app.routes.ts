import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Публичные маршруты (без layout)
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Защищенные маршруты с layout
  {
    path: 'app',
    loadComponent: () => import('./core/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      // Главная страница - Загрузка чека (HR-менеджер)
      {
        path: '',
        loadComponent: () => import('./features/receipts/receipts-page/receipts-page.component').then(m => m.ReceiptsPageComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager'] }
      },
      // Receipts List - Список чеков (HR-менеджер, Админ)
      {
        path: 'receipts',
        loadComponent: () => import('./features/receipts/cheques-list/cheques-list.component').then(m => m.ChequesListComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'admin'] }
      },

      // Analytics (Экономист, Директор)
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
        canActivate: [roleGuard],
        data: { roles: ['economist', 'director', 'admin'] }
      },

      // Reports (Директор, Админ, HR, Экономист - открываем доступ всем для отладки)
      {
        path: 'reports',
        loadComponent: () => import('./features/analytics/reports.component').then(m => m.ReportsComponent),
        canActivate: [roleGuard],
        data: { roles: ['director', 'admin', 'hr-manager', 'economist'] }
      },

      // Warehouse (HR, Экономист, Админ)
      {
        path: 'warehouse',
        loadComponent: () => import('./features/warehouse/warehouse.component').then(m => m.WarehouseComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'economist', 'admin'] }
      },

      // Categories (HR, Экономист, Админ)
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'economist', 'admin'] }
      },

      // Notifications (Все роли)
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'economist', 'director', 'admin'] }
      },

      // Profile (Все роли)
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'economist', 'director', 'admin'] }
      },

      // Admin (Только админ)
      {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
      },

    ]
  },

  // Root redirect
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  // 404
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
