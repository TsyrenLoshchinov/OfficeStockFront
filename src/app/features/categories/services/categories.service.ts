import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Category } from '../../../core/models/category.model';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  getCategories(): Observable<Category[]> {
    if (environment.useMockAuth) {
      // Mock данные для разработки
      const mockCategories: Category[] = [
        { id: 1, name: 'Аптека', createdAt: '2025-01-01' },
        { id: 2, name: 'Вафли', createdAt: '2025-01-02' },
        { id: 3, name: 'Вода', createdAt: '2025-01-03' },
        { id: 4, name: 'Кофе', createdAt: '2025-01-04' },
        { id: 5, name: 'Молоко', createdAt: '2025-01-05' },
        { id: 6, name: 'Печенье', createdAt: '2025-01-06' }
      ];
      return of(mockCategories).pipe(delay(300));
    }

    return this.http.get<Category[]>(`${this.apiService.getBaseUrl()}/categories/`);
  }

  addCategory(name: string): Observable<Category> {
    if (environment.useMockAuth) {
      const newCategory: Category = {
        id: Date.now(),
        name: name,
        createdAt: new Date().toISOString()
      };
      return of(newCategory).pipe(delay(300));
    }

    return this.http.post<Category>(`${this.apiService.getBaseUrl()}/categories/`, { name });
  }

  deleteCategory(name: string): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    // API requires DELETE with body containing category name
    return this.http.delete<void>(
      `${this.apiService.getBaseUrl()}/categories/`,
      {
        body: { name }
      }
    );
  }
}

