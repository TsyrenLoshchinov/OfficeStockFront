import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing-module';
import { Orders } from './orders';
import { OrdersList } from './list/orders-list';
import { OrderDetails } from './detail/order-details';
import { OrderCreate } from './create/order-create';

@NgModule({
  declarations: [
    Orders,
    OrdersList,
    OrderDetails,
    OrderCreate,
  ],
  imports: [CommonModule, RouterModule, FormsModule, OrdersRoutingModule],
})
export class OrdersModule {}

