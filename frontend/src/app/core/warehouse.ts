import { Injectable, signal } from '@angular/core';
import { Category, ForecastEntry, Product, StockItem, WriteOff } from '../models/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class Warehouse {
  private readonly categories = signal<Category[]>([
    { id: 'c1', name: 'Канцелярия', itemsCount: 12 },
    { id: 'c2', name: 'Офисная кухня', itemsCount: 8 },
  ]);

  private readonly products = signal<Product[]>([
    { id: 'p1', name: 'Бумага A4', categoryId: 'c1', unit: 'упак.' },
    { id: 'p2', name: 'Скотч', categoryId: 'c1', unit: 'шт' },
    { id: 'p3', name: 'Кофе зерновой', categoryId: 'c2', unit: 'кг' },
  ]);

  private readonly stock = signal<StockItem[]>([
    { productId: 'p1', quantity: 25, threshold: 10 },
    { productId: 'p3', quantity: 6, threshold: 5 },
  ]);

  private readonly writeOffs = signal<WriteOff[]>([
    { id: 'w1', productId: 'p2', quantity: 3, reason: 'Повреждение', date: new Date() },
  ]);

  private readonly forecast = signal<ForecastEntry[]>([
    { productId: 'p1', expectedNeed: 15, period: 'март' },
    { productId: 'p3', expectedNeed: 4, period: 'март' },
  ]);

  getCategories() {
    return this.categories.asReadonly();
  }

  getProducts() {
    return this.products.asReadonly();
  }

  getStock() {
    return this.stock.asReadonly();
  }

  getWriteOffs() {
    return this.writeOffs.asReadonly();
  }

  getForecast() {
    return this.forecast.asReadonly();
  }
}

