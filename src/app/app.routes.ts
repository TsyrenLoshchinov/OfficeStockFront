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
      // Receipts (HR-менеджер)
      {
        path: 'receipts',
        loadComponent: () => import('./features/receipts/receipts-page/receipts-page.component').then(m => m.ReceiptsPageComponent),
        canActivate: [roleGuard],
        data: { roles: ['hr-manager'] }
      },
      
      // Analytics (Экономист, Директор)
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
        canActivate: [roleGuard],
        data: { roles: ['economist', 'director', 'admin'] }
      },
      
      // Reports (Директор)
      {
        path: 'reports',
        loadComponent: () => import('./features/analytics/reports.component').then(m => m.ReportsComponent),
        canActivate: [roleGuard],
        data: { roles: ['director', 'admin'] }
      },
      
      // Warehouse (HR, Экономист, Админ)
      {
        path: 'warehouse',
        loadComponent: () => import('./features/warehouse/warehouse.component').then(m => m.WarehouseComponent),
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
      
      // Admin (Только админ)
      {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
      },
      
      // Redirect по умолчанию
      {
        path: '',
        redirectTo: 'receipts',
        pathMatch: 'full'
      }
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
