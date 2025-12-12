import { Component, computed } from '@angular/core';
import { Orders } from '../../../core/orders';

@Component({
  selector: 'app-orders-list',
  standalone: false,
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss',
})
export class OrdersList {
  protected readonly orders = computed(() => this.ordersService.getOrders()());

  constructor(private readonly ordersService: Orders) {}
}

