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
      // Главная страница - Загрузка чека (HR-менеджер, Admin)
      {
        path: '',
        loadComponent: () => import('./features/receipts/receipts-page/receipts-page.component').then(m => m.ReceiptsPageComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'admin'] }
      },
      // Receipts List - Список чеков (HR-менеджер, Админ)
      {
        path: 'receipts',
        loadComponent: () => import('./features/receipts/cheques-list/cheques-list.component').then(m => m.ChequesListComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'admin'] }
      },

      // Analytics (Экономист, Admin - Analytics page actually looks redundant if Reports is main, but user asked for "Reports" for Economist. 
      // User said "economist: profile, warehouse, reports".
      // There is 'analytics' route and 'reports' route. 
      // The user specifically said "отчеты" (reports) for economist, not "аналитика" (analytics).
      // I will give access to reports for economist.
      // But usually 'analytics' was for economist. I'll stick to user instructions: Reports for Economist.
      // What about Analytics route? User didn't mention it. I'll leave it accessible to Admin only to be safe? 
      // Or maybe Economist meant Analytics? "отчеты" usually translates to "Reports".
      // Let's assume Analytics is legacy or secondary, and stick to Reports for Economist.)
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] } // Hiding from economist unless asked
      },

      // Reports (Директор, Админ, Экономист)
      {
        path: 'reports',
        loadComponent: () => import('./features/analytics/reports.component').then(m => m.ReportsComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'economist'] }
      },

      // Warehouse (Все роли, но разный доступ)
      {
        path: 'warehouse',
        loadComponent: () => import('./features/warehouse/warehouse.component').then(m => m.WarehouseComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'economist', 'director', 'admin'] }
      },

      // Categories (HR, Админ)
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'admin'] }
      },

      // Notifications (HR, Админ)
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager', 'admin'] }
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
