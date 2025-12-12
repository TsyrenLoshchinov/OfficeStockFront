import { Injectable, signal } from '@angular/core';
import { Category, Product, StockItem } from '../models/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly categories = signal<Category[]>([
    { id: 'c1', name: 'Канцелярия', itemsCount: 12 },
    { id: 'c2', name: 'Офисная кухня', itemsCount: 8 },
    { id: 'c3', name: 'Аптека', itemsCount: 5 },
    { id: 'c4', name: 'Чай', itemsCount: 3 },
    { id: 'c5', name: 'Не определёно', itemsCount: 2 },
  ]);

  private readonly products = signal<Product[]>([
    { id: 'p1', name: 'Бумага A4', categoryId: 'c1', unit: 'упак.' },
    { id: 'p2', name: 'Скотч', categoryId: 'c1', unit: 'шт' },
    { id: 'p3', name: 'Кофе зерновой', categoryId: 'c2', unit: 'кг' },
    { id: 'p4', name: 'Пластырь прозрачный 3 шт.', categoryId: 'c3', unit: 'шт' },
    { id: 'p5', name: 'Вафли «Яшкино»', categoryId: 'c5', unit: 'шт' },
    { id: 'p6', name: 'Чай зеленый «Fantasy Peach»', categoryId: 'c4', unit: 'шт' },
  ]);

  private readonly stock = signal<StockItem[]>([
    { productId: 'p1', quantity: 25, threshold: 10 },
    { productId: 'p3', quantity: 6, threshold: 5 },
    { productId: 'p4', quantity: 10, threshold: 5 },
    { productId: 'p5', quantity: 5, threshold: 3 },
    { productId: 'p6', quantity: 8, threshold: 5 },
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

  addCategory(name: string): void {
    const category: Category = {
      id: Date.now().toString(),
      name,
      itemsCount: 0,
    };
    this.categories.update((categories) => [...categories, category]);
  }

  updateCategory(id: string, name: string): void {
    this.categories.update((categories) =>
      categories.map((c) => (c.id === id ? { ...c, name } : c))
    );
  }
}
