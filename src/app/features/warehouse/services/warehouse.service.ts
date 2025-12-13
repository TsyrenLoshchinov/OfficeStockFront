import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { WarehouseItem, WriteOffRule, CreateWriteOffRulePayload } from '../../../core/models/warehouse.model';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getWarehouseItems(): Observable<WarehouseItem[]> {
    if (environment.useMockAuth) {
      // Mock данные для разработки
      const mockItems: WarehouseItem[] = [
        {
          id: 1,
          name: 'Пластырь прозрачный 3шт.',
          category: 'Аптека',
          estimatedConsumptionDate: null, // Недостаточно данных
          quantity: 3,
          writeOffQuantity: 3
        },
        {
          id: 2,
          name: 'Вафли «Яшкино»',
          category: 'Печенье',
          estimatedConsumptionDate: '2025-11-25',
          quantity: 5,
          writeOffQuantity: 5
        },
        {
          id: 3,
          name: 'Чай зеленый «Fantasy Peach»',
          category: 'Чай',
          estimatedConsumptionDate: '2025-12-26',
          quantity: 1,
          writeOffQuantity: 1
        }
      ];
      return of(mockItems).pipe(delay(300));
    }

    return this.http.get<WarehouseItem[]>(`${this.apiService.getBaseUrl()}/warehouse/items`);
  }

  writeOffItem(itemId: number, quantity: number): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    return this.http.post<void>(`${this.apiService.getBaseUrl()}/warehouse/items/${itemId}/write-off`, { quantity });
  }

  getWriteOffRules(): Observable<WriteOffRule[]> {
    if (environment.useMockAuth) {
      // Mock данные для правил списания
      const mockRules: WriteOffRule[] = [
        {
          id: 1,
          itemId: 2,
          itemName: 'Вафли «Яшкино»',
          frequency: 2,
          frequencyUnit: 'days'
        },
        {
          id: 2,
          itemId: 3,
          itemName: 'Чай зеленый «Fantasy Peach»',
          frequency: 3,
          frequencyUnit: 'days'
        },
        {
          id: 3,
          itemId: 1,
          itemName: 'Пластырь прозрачный 3шт.',
          frequency: 2,
          frequencyUnit: 'weeks'
        }
      ];
      return of(mockRules).pipe(delay(300));
    }

    return this.http.get<WriteOffRule[]>(`${this.apiService.getBaseUrl()}/warehouse/write-off-rules`);
  }

  createWriteOffRule(payload: CreateWriteOffRulePayload): Observable<WriteOffRule> {
    if (environment.useMockAuth) {
      const newRule: WriteOffRule = {
        id: Date.now(),
        itemId: payload.itemId,
        itemName: 'Товар', // В реальности получаем из бэка
        frequency: payload.frequency,
        frequencyUnit: payload.frequencyUnit
      };
      return of(newRule).pipe(delay(300));
    }

    return this.http.post<WriteOffRule>(`${this.apiService.getBaseUrl()}/warehouse/write-off-rules`, payload);
  }

  deleteWriteOffRule(ruleId: number): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    return this.http.delete<void>(`${this.apiService.getBaseUrl()}/warehouse/write-off-rules/${ruleId}`);
  }

  deleteAllWriteOffRules(): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    return this.http.delete<void>(`${this.apiService.getBaseUrl()}/warehouse/write-off-rules`);
  }
}

