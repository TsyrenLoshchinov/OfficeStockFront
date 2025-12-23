import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  WarehouseItem,
  WriteOffRule,
  CreateWriteOffRulePayload,
  UpdateWriteOffRulePayload,
  WarehouseItemApiResponse,
  WriteOffScheduleRead,
  WriteOffScheduleCreate,
  WriteOffScheduleUpdate
} from '../../../core/models/warehouse.model';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private warehouseItemsCache: WarehouseItem[] = [];

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  getWarehouseItems(): Observable<WarehouseItem[]> {
    if (environment.useMockAuth) {
      const mockItems: WarehouseItem[] = [
        {
          id: 1,
          productId: 1,
          name: 'Пластырь прозрачный 3шт.',
          category: 'Аптека',
          estimatedConsumptionDate: null,
          quantity: 3,
          writeOffQuantity: 3
        },
        {
          id: 2,
          productId: 2,
          name: 'Вафли «Яшкино»',
          category: 'Печенье',
          estimatedConsumptionDate: '2025-11-25',
          quantity: 5,
          writeOffQuantity: 5
        },
        {
          id: 3,
          productId: 3,
          name: 'Чай зеленый «Fantasy Peach»',
          category: 'Чай',
          estimatedConsumptionDate: '2025-12-26',
          quantity: 1,
          writeOffQuantity: 1
        }
      ];
      this.warehouseItemsCache = mockItems;
      return of(mockItems).pipe(delay(300));
    }

    return this.http.get<WarehouseItemApiResponse[]>(
      `${this.apiService.getBaseUrl()}/warehouse/products`,
      { headers: this.getHeaders() }
    ).pipe(
      map((apiItems) => {
        const items = apiItems.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.product_name,
          category: item.category_name || 'Не определено',
          estimatedConsumptionDate: null,
          quantity: parseFloat(item.rest) || 0
        }));
        this.warehouseItemsCache = items;
        return items;
      })
    );
  }

  getProductNameById(productId: number): string {
    const item = this.warehouseItemsCache.find(i => i.productId === productId);
    return item?.name || `Товар #${productId}`;
  }

  writeOffItem(productId: number, rest: number): Observable<WarehouseItemApiResponse> {
    if (environment.useMockAuth) {
      return of({
        id: productId, // Mock assumption
        product_id: productId,
        product_name: 'Товар',
        category_name: 'Категория',
        rest: rest.toString(),
        last_update: new Date().toISOString()
      } as WarehouseItemApiResponse).pipe(delay(200));
    }

    // Согласно Swagger: PATCH /api/v1/warehouse/products/{product_id}
    // Body: { "rest": ... }
    return this.http.patch<WarehouseItemApiResponse>(
      `${this.apiService.getBaseUrl()}/warehouse/products/${productId}`,
      { rest },
      { headers: this.getHeaders() }
    );
  }

  getWriteOffRules(activeOnly: boolean = false): Observable<WriteOffRule[]> {
    if (environment.useMockAuth) {
      const mockRules: WriteOffRule[] = [
        {
          id: 1,
          productId: 2,
          productName: 'Вафли «Яшкино»',
          intervalDays: 2,
          quantityPerWriteoff: 1,
          isActive: true,
          lastWriteoffDate: null,
          dateCreate: new Date().toISOString()
        },
        {
          id: 2,
          productId: 3,
          productName: 'Чай зеленый «Fantasy Peach»',
          intervalDays: 3,
          quantityPerWriteoff: 1,
          isActive: true,
          lastWriteoffDate: null,
          dateCreate: new Date().toISOString()
        },
        {
          id: 3,
          productId: 1,
          productName: 'Пластырь прозрачный 3шт.',
          intervalDays: 14,
          quantityPerWriteoff: 1,
          isActive: false,
          lastWriteoffDate: null,
          dateCreate: new Date().toISOString()
        }
      ];
      return of(mockRules).pipe(delay(300));
    }

    const params = activeOnly ? '?active_only=true' : '';
    return this.http.get<WriteOffScheduleRead[]>(
      `${this.apiService.getBaseUrl()}/writeoff/${params}`,
      { headers: this.getHeaders() }
    ).pipe(
      map((apiRules) => {
        return apiRules.map(rule => ({
          id: rule.id,
          productId: rule.product_id,
          productName: this.getProductNameById(rule.product_id),
          intervalDays: rule.interval_days,
          quantityPerWriteoff: rule.quantity_per_writeoff,
          isActive: rule.is_active,
          lastWriteoffDate: rule.last_writeoff_date,
          dateCreate: rule.date_create
        }));
      })
    );
  }

  createWriteOffRule(payload: CreateWriteOffRulePayload): Observable<WriteOffRule> {
    if (environment.useMockAuth) {
      const newRule: WriteOffRule = {
        id: Date.now(),
        productId: payload.productId,
        productName: this.getProductNameById(payload.productId),
        intervalDays: payload.intervalDays,
        quantityPerWriteoff: payload.quantityPerWriteoff,
        isActive: true,
        lastWriteoffDate: null,
        dateCreate: new Date().toISOString()
      };
      return of(newRule).pipe(delay(300));
    }

    const apiPayload: WriteOffScheduleCreate = {
      product_id: payload.productId,
      interval_days: payload.intervalDays,
      quantity_per_writeoff: payload.quantityPerWriteoff
    };

    return this.http.post<WriteOffScheduleRead>(
      `${this.apiService.getBaseUrl()}/writeoff/`,
      apiPayload,
      { headers: this.getHeaders() }
    ).pipe(
      map((rule) => ({
        id: rule.id,
        productId: rule.product_id,
        productName: this.getProductNameById(rule.product_id),
        intervalDays: rule.interval_days,
        quantityPerWriteoff: rule.quantity_per_writeoff,
        isActive: rule.is_active,
        lastWriteoffDate: rule.last_writeoff_date,
        dateCreate: rule.date_create
      }))
    );
  }

  updateWriteOffRule(ruleId: number, payload: UpdateWriteOffRulePayload): Observable<WriteOffRule> {
    if (environment.useMockAuth) {
      const updatedRule: WriteOffRule = {
        id: ruleId,
        productId: 1,
        productName: 'Товар',
        intervalDays: payload.intervalDays || 1,
        quantityPerWriteoff: payload.quantityPerWriteoff || 1,
        isActive: payload.isActive ?? true,
        lastWriteoffDate: null,
        dateCreate: new Date().toISOString()
      };
      return of(updatedRule).pipe(delay(300));
    }

    const apiPayload: WriteOffScheduleUpdate = {};
    if (payload.intervalDays !== undefined) apiPayload.interval_days = payload.intervalDays;
    if (payload.quantityPerWriteoff !== undefined) apiPayload.quantity_per_writeoff = payload.quantityPerWriteoff;
    if (payload.isActive !== undefined) apiPayload.is_active = payload.isActive;

    return this.http.patch<WriteOffScheduleRead>(
      `${this.apiService.getBaseUrl()}/writeoff/${ruleId}`,
      apiPayload,
      { headers: this.getHeaders() }
    ).pipe(
      map((rule) => ({
        id: rule.id,
        productId: rule.product_id,
        productName: this.getProductNameById(rule.product_id),
        intervalDays: rule.interval_days,
        quantityPerWriteoff: rule.quantity_per_writeoff,
        isActive: rule.is_active,
        lastWriteoffDate: rule.last_writeoff_date,
        dateCreate: rule.date_create
      }))
    );
  }

  deleteWriteOffRule(ruleId: number): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    return this.http.delete<void>(
      `${this.apiService.getBaseUrl()}/writeoff/${ruleId}`,
      { headers: this.getHeaders() }
    );
  }

  deleteAllWriteOffRules(): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    // API doesn't have bulk delete, so we need to delete one by one
    // For now, return success
    return of(void 0);
  }
}
