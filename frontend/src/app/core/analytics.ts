import { Injectable, signal } from '@angular/core';
import { AnalyticsPoint, ExpenseDynamics, ExpenseStructure } from '../models/analytics.model';

@Injectable({
  providedIn: 'root',
})
export class Analytics {
  private readonly overview = signal<AnalyticsPoint[]>([
    { label: 'Янв', value: 120000 },
    { label: 'Фев', value: 95000 },
    { label: 'Мар', value: 134000 },
  ]);

  private readonly structure = signal<ExpenseStructure[]>([
    { category: 'Канцелярия', percent: 35 },
    { category: 'Кухня', percent: 25 },
    { category: 'Хозяйственные товары', percent: 20 },
    { category: 'Прочее', percent: 20 },
  ]);

  private readonly dynamics = signal<ExpenseDynamics[]>([
    { period: 'Неделя 1', amount: 34000 },
    { period: 'Неделя 2', amount: 28000 },
    { period: 'Неделя 3', amount: 41000 },
  ]);

  getOverview() {
    return this.overview.asReadonly();
  }

  getStructure() {
    return this.structure.asReadonly();
  }

  getDynamics() {
    return this.dynamics.asReadonly();
  }
}

