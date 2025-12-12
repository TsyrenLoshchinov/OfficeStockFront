import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Orders } from './orders';
import { OrdersList } from './list/orders-list';
import { OrderDetails } from './detail/order-details';
import { OrderCreate } from './create/order-create';

const routes: Routes = [
  {
    path: '',
    component: Orders,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: OrdersList },
      { path: 'create', component: OrderCreate },
      { path: ':id', component: OrderDetails },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}

