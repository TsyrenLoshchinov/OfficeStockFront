import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Report, ReportApiResponse, mapReportFromApi } from '../../../core/models/report.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReportsApiService {
    private readonly mockApiUrl = 'http://192.168.2.51:8001/api/v1/mock';

    constructor(
        private http: HttpClient,
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

    getReports(): Observable<Report[]> {
        if (environment.useMockAuth) {
            return of(this.getMockReports()).pipe(delay(300));
        }

        return this.http.get<ReportApiResponse[]>(
            `${this.mockApiUrl}/reports`,
            { headers: this.getHeaders() }
        ).pipe(
            map(reports => reports.map(mapReportFromApi)),
            catchError(error => {
                console.error('Error loading reports:', error);
                // Return mock data if API is not available
                return of(this.getMockReports());
            })
        );
    }

    private getMockReports(): Report[] {
        const now = new Date();
        return [
            {
                id: 1,
                title: 'Месячный отчет по расходам - Декабрь',
                date: new Date(now.getFullYear(), now.getMonth(), 20, 10, 0, 0).toISOString(),
                status: 'completed',
                description: 'Детальный анализ расходов за декабрь 2024 года. Включает данные по всем категориям товаров.'
            },
            {
                id: 2,
                title: 'Отчет по остаткам на складе',
                date: new Date(now.getFullYear(), now.getMonth(), 18, 14, 30, 0).toISOString(),
                status: 'completed',
                description: 'Текущее состояние склада с информацией о товарах, требующих пополнения.'
            },
            {
                id: 3,
                title: 'Квартальный отчет Q4 2024',
                date: new Date(now.getFullYear(), now.getMonth(), 15, 9, 0, 0).toISOString(),
                status: 'pending',
                description: 'Сводный квартальный отчет - в процессе формирования.'
            },
            {
                id: 4,
                title: 'Отчет по поставщикам',
                date: new Date(now.getFullYear(), now.getMonth(), 10, 11, 0, 0).toISOString(),
                status: 'completed',
                description: 'Анализ работы с поставщиками: количество чеков, суммы, средние чеки.'
            },
            {
                id: 5,
                title: 'Отчет по автоматическому списанию',
                date: new Date(now.getFullYear(), now.getMonth(), 5, 16, 0, 0).toISOString(),
                status: 'failed',
                description: 'Ошибка при формировании отчета. Требуется повторная генерация.'
            }
        ];
    }
}
