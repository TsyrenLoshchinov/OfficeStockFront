import { Injectable, signal } from '@angular/core';
import { Order, OrderItem } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class Orders {
  private readonly orders = signal<Order[]>([
    { id: 'o1', requester: 'HR', status: 'approved', total: 15400, createdAt: new Date() },
    { id: 'o2', requester: 'Office', status: 'submitted', total: 8200, createdAt: new Date() },
  ]);

  private readonly itemsMap: Record<string, OrderItem[]> = {
    o1: [
      { productId: 'p1', name: 'Бумага A4', qty: 10, price: 500 },
      { productId: 'p3', name: 'Кофе зерновой', qty: 2, price: 1200 },
    ],
    o2: [{ productId: 'p2', name: 'Скотч', qty: 5, price: 300 }],
  };

  getOrders() {
    return this.orders.asReadonly();
  }

  getOrderItems(orderId: string) {
    return this.itemsMap[orderId] ?? [];
  }
}

