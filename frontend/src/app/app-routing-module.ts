import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'receipts/add', pathMatch: 'full' },
  { path: 'receipts', loadChildren: () => import('./features/receipts/receipts-module').then(m => m.ReceiptsModule) },
  { path: '**', redirectTo: 'receipts/add' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
