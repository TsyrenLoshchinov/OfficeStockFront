import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

// API Response interfaces based on Swagger spec
export interface ExpenseReportItem {
    category_name: string;
    total_amount: string;
}

export interface ExpenseReportResponse {
    total: string;
    by_category: ExpenseReportItem[];
}

export interface ExpenseReportCompanyItem {
    company_name: string | null;
    total_amount: string;
}

export interface ExpenseReportCompanyResponse {
    total: string;
    by_company: ExpenseReportCompanyItem[];
}

// Frontend interfaces
export interface CategoryExpense {
    category: string;
    amount: number;
}

export interface SupplierExpense {
    name: string;
    totalAmount: number;
}

@Injectable({
    providedIn: 'root'
})
export class ReportsApiService {

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) { }

    getExpensesByCategory(startDate: string, endDate: string): Observable<{ total: number; categories: CategoryExpense[] }> {
        if (environment.useMockAuth) {
            return of({
                total: 986.00,
                categories: [
                    { category: 'Вафли', amount: 445.00 },
                    { category: 'Аптека', amount: 378.00 },
                    { category: 'Чай', amount: 163.00 }
                ]
            });
        }

        return this.http.get<ExpenseReportResponse>(
            `${this.apiService.getBaseUrl()}/reports/expenses`,
            { params: { start_date: startDate, end_date: endDate } }
        ).pipe(
            map(response => ({
                total: parseFloat(response.total) || 0,
                categories: response.by_category.map(item => ({
                    category: item.category_name,
                    amount: parseFloat(item.total_amount) || 0
                }))
            })),
            catchError(error => {
                console.error('Error loading expenses report:', error);
                return of({ total: 0, categories: [] });
            })
        );
    }

    getExpensesByCompany(startDate: string, endDate: string): Observable<{ total: number; suppliers: SupplierExpense[] }> {
        if (environment.useMockAuth) {
            return of({
                total: 1731.00,
                suppliers: [
                    { name: 'ООО «Магнит»', totalAmount: 986.00 },
                    { name: 'ООО «Ярче»', totalAmount: 745.00 }
                ]
            });
        }

        return this.http.get<ExpenseReportCompanyResponse>(
            `${this.apiService.getBaseUrl()}/reports/expenses-by-company`,
            { params: { start_date: startDate, end_date: endDate } }
        ).pipe(
            map(response => ({
                total: parseFloat(response.total) || 0,
                suppliers: response.by_company.map(item => ({
                    name: item.company_name || 'Не указано',
                    totalAmount: parseFloat(item.total_amount) || 0
                }))
            })),
            catchError(error => {
                console.error('Error loading suppliers report:', error);
                return of({ total: 0, suppliers: [] });
            })
        );
    }
}
