import { Component, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Orders } from '../../../core/orders';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  protected readonly orderId = computed(() => this.route.snapshot.paramMap.get('id') || '');
  protected readonly order = computed(() => {
    const id = this.orderId();
    return this.ordersService.getOrders()().find((o) => o.id === id);
  });
  protected readonly items = computed(() => this.ordersService.getOrderItems(this.orderId()));

  constructor(private readonly ordersService: Orders, private readonly route: ActivatedRoute) {}
}

