import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receipt, ReceiptUploadResponse, ReceiptConfirmPayload } from '../../../core/models/receipt.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  uploadReceipt(file: File): Observable<ReceiptUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ReceiptUploadResponse>(
      `${this.apiService.getBaseUrl()}/receipts/upload`,
      formData
    );
  }

  confirmReceipt(receiptData: Receipt): Observable<void> {
    const payload: ReceiptConfirmPayload = { receiptData };
    return this.http.post<void>(
      `${this.apiService.getBaseUrl()}/receipts/confirm`,
      payload
    );
  }
}

