import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: () => import('./features/main/main-module').then(m => m.MainModule) },
      { path: 'profile', loadChildren: () => import('./features/profile/profile-module').then(m => m.ProfileModule) },
      { path: 'checks', loadChildren: () => import('./features/checks/checks-module').then(m => m.ChecksModule) },
      { path: 'notifications', loadChildren: () => import('./features/notifications/notifications-module').then(m => m.NotificationsModule) },
      { path: 'receipts', loadChildren: () => import('./features/receipts/receipts-module').then(m => m.ReceiptsModule) },
      { path: 'recognition', loadChildren: () => import('./features/recognition/recognition-module').then(m => m.RecognitionModule) },
      { path: 'warehouse', loadChildren: () => import('./features/warehouse/warehouse-module').then(m => m.WarehouseModule) },
      { path: 'analytics', loadChildren: () => import('./features/analytics/analytics-module').then(m => m.AnalyticsModule) },
      { path: 'orders', loadChildren: () => import('./features/orders/orders-module').then(m => m.OrdersModule) },
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
