import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Receipt, ReceiptUploadResponse, ReceiptConfirmPayload, ReceiptUploadApiResponse } from '../../../core/models/receipt.model';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  uploadReceipt(file: File): Observable<ReceiptUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      // Не устанавливаем Content-Type для FormData - браузер сделает это автоматически с boundary
    });
    
    return this.http.post<ReceiptUploadApiResponse>(
      `${this.apiService.getBaseUrl()}/receipts/upload`,
      formData,
      { headers }
    ).pipe(
      map((apiResponse) => {
        // Маппим ответ API в формат ReceiptUploadResponse
        const receipt = apiResponse.receipt;
        return {
          organization: receipt.name_supplier || '',
          purchaseDate: receipt.date_buy,
          totalAmount: receipt.sum,
          items: receipt.items.map(item => ({
            name: item.product_name,
            quantity: item.count_product,
            price: item.unit_price,
            category: item.category_name && item.category_name.trim() ? item.category_name : undefined
          })),
          // Сохраняем дополнительные поля для отправки при подтверждении
          fiscal_number: receipt.fiscal_number,
          fiscal_document: receipt.fiscal_document,
          fiscal_sign: receipt.fiscal_sign,
          order_name: receipt.order_name
        } as ReceiptUploadResponse;
      })
    );
  }

  confirmReceipt(receiptData: Receipt): Observable<void> {
    // Маппим данные Receipt в формат ReceiptConfirmPayload для отправки на бэкенд
    const payload: ReceiptConfirmPayload = {
      order_name: receiptData.order_name || null,
      fiscal_number: receiptData.fiscal_number || null,
      fiscal_document: receiptData.fiscal_document || null,
      fiscal_sign: receiptData.fiscal_sign || null,
      sum: receiptData.totalAmount,
      date_buy: receiptData.purchaseDate,
      name_supplier: receiptData.organization,
      items: receiptData.items.map(item => ({
        product_name: item.name,
        count_product: item.quantity,
        unit_price: item.price,
        sum: item.price * item.quantity,
        category_name: item.category || null
      }))
    };
    return this.http.post<void>(
      `${this.apiService.getBaseUrl()}/receipts/confirm`,
      payload,
      { headers: this.getHeaders() }
    );
  }
}

