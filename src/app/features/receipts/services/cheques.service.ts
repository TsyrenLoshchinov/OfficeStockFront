import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Cheque } from '../../../core/models/cheque.model';
import { Receipt, ReceiptRead, ReceiptItemRead } from '../../../core/models/receipt.model';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChequesService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  getCheques(): Observable<Cheque[]> {
    if (environment.useMockAuth) {
      // Mock данные для разработки
      const mockCheques: Cheque[] = [
        {
          id: 1,
          number: '001',
          date: '2025-12-10',
          fileName: 'receipt_001.jpg',
          uploadedAt: '2025-12-10T10:30:00',
          organization: 'ПАО «Магнит»',
          totalAmount: 485.00,
          status: 'confirmed'
        },
        {
          id: 2,
          number: '002',
          date: '2025-12-09',
          fileName: 'receipt_002.pdf',
          uploadedAt: '2025-12-09T14:20:00',
          organization: 'ООО «Пятёрочка»',
          totalAmount: 1200.50,
          status: 'pending'
        },
        {
          id: 3,
          number: '003',
          date: '2025-12-08',
          fileName: 'receipt_003.jpg',
          uploadedAt: '2025-12-08T09:15:00',
          organization: 'ПАО «Магнит»',
          totalAmount: 750.00,
          status: 'confirmed'
        }
      ];
      return of(mockCheques).pipe(delay(300));
    }

    // API returns ReceiptRead[] which we need to map to Cheque[]
    return this.http.get<ReceiptRead[]>(`${this.apiService.getBaseUrl()}/receipts/`).pipe(
      map(receipts => receipts.map(receipt => this.mapReceiptReadToCheque(receipt)))
    );
  }

  private mapReceiptReadToCheque(receipt: ReceiptRead): Cheque {
    return {
      id: receipt.id ?? 0,
      number: receipt.fiscal_document || receipt.id?.toString() || 'Без номера',
      date: receipt.date_buy || '',
      fileName: receipt.order_name || `receipt_${receipt.id || 'unknown'}.jpg`,
      uploadedAt: receipt.date_create || receipt.date_buy || '',
      organization: receipt.name_supplier || 'Не указано',
      totalAmount: receipt.sum || 0,
      status: 'confirmed'
    };
  }

  deleteCheque(id: number): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    return this.http.delete<void>(`${this.apiService.getBaseUrl()}/receipts/${id}`);
  }

  deleteAllCheques(): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    return this.http.delete<void>(`${this.apiService.getBaseUrl()}/receipts`);
  }

  getChequeById(id: number): Observable<Cheque> {
    if (environment.useMockAuth) {
      const mockCheque: Cheque = {
        id: id,
        number: `00${id}`,
        date: '2025-12-10',
        fileName: `receipt_00${id}.jpg`,
        uploadedAt: '2025-12-10T10:30:00',
        organization: 'ПАО «Магнит»',
        totalAmount: 485.00,
        status: 'confirmed'
      };
      return of(mockCheque).pipe(delay(200));
    }

    return this.http.get<Cheque>(`${this.apiService.getBaseUrl()}/receipts/${id}`);
  }

  getReceiptById(id: number): Observable<Receipt> {
    if (environment.useMockAuth) {
      // Mock данные с товарами для модального окна
      // Разные данные в зависимости от ID чека
      const receipts: Record<number, Receipt> = {
        1: {
          organization: 'ПАО «Магнит»',
          purchaseDate: '2025-12-10',
          totalAmount: 485.00,
          items: [
            {
              name: 'Пластырь прозрачный 3 шт.',
              quantity: 2,
              price: 126.00,
              category: 'Аптека'
            },
            {
              name: 'Вафли «Яшкино»',
              quantity: 1,
              price: 89.00,
              category: 'Не определёно'
            },
            {
              name: 'Чай зеленый «Fantasy Peach»',
              quantity: 1,
              price: 163.00,
              category: 'Чай'
            }
          ]
        },
        2: {
          organization: 'ООО «Пятёрочка»',
          purchaseDate: '2025-12-09',
          totalAmount: 1200.50,
          items: [
            {
              name: 'Хлеб белый',
              quantity: 2,
              price: 45.00,
              category: 'Продукты'
            },
            {
              name: 'Молоко 3.2%',
              quantity: 3,
              price: 85.50,
              category: 'Продукты'
            },
            {
              name: 'Яйца куриные С1',
              quantity: 1,
              price: 120.00,
              category: 'Продукты'
            }
          ]
        },
        3: {
          organization: 'ПАО «Магнит»',
          purchaseDate: '2025-12-08',
          totalAmount: 750.00,
          items: [
            {
              name: 'Ручка шариковая',
              quantity: 5,
              price: 25.00,
              category: 'Офисные принадлежности'
            },
            {
              name: 'Бумага А4',
              quantity: 1,
              price: 350.00,
              category: 'Офисные принадлежности'
            },
            {
              name: 'Скотч',
              quantity: 2,
              price: 50.00,
              category: 'Офисные принадлежности'
            }
          ]
        }
      };

      const mockReceipt = receipts[id] || receipts[1];
      return of(mockReceipt).pipe(delay(200));
    }

    return this.http.get<ReceiptRead>(`${this.apiService.getBaseUrl()}/receipts/${id}`).pipe(
      map((apiReceipt: ReceiptRead) => this.mapReceiptReadToReceipt(apiReceipt))
    );
  }

  private mapReceiptReadToReceipt(apiReceipt: ReceiptRead): Receipt {
    return {
      organization: apiReceipt.name_supplier || 'Не указано',
      purchaseDate: apiReceipt.date_buy ? new Date(apiReceipt.date_buy).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      totalAmount: apiReceipt.sum,
      items: apiReceipt.items.map((item: ReceiptItemRead) => ({
        name: item.product_name,
        quantity: item.count_product,
        price: item.unit_price,
        category: item.category_name || undefined
      }))
    };
  }
}

