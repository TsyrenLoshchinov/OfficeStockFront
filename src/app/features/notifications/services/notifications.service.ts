import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Notification, NotificationApiResponse, mapNotificationFromApi } from '../../../core/models/notification.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
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

    getNotifications(): Observable<Notification[]> {
        if (environment.useMockAuth) {
            return of(this.getMockNotifications()).pipe(delay(300));
        }

        return this.http.get<NotificationApiResponse[]>(
            `${this.mockApiUrl}/notifications`,
            { headers: this.getHeaders() }
        ).pipe(
            map(notifications => notifications.map(mapNotificationFromApi)),
            catchError(error => {
                console.error('Error loading notifications:', error);
                // Return mock data if API is not available
                return of(this.getMockNotifications());
            })
        );
    }

    markAsRead(notificationId: number): Observable<void> {
        // Mock implementation - in a real app, this would call an API
        return of(void 0).pipe(delay(100));
    }

    deleteNotification(notificationId: number): Observable<void> {
        // Mock implementation - in a real app, this would call an API
        return of(void 0).pipe(delay(100));
    }

    clearAllNotifications(): Observable<void> {
        // Mock implementation
        return of(void 0).pipe(delay(100));
    }

    private getMockNotifications(): Notification[] {
        return [
            {
                id: 1,
                title: 'Системное обслуживание',
                message: 'Запланированное обслуживание системы состоится сегодня в 22:00. Пожалуйста, сохраните всю работу.',
                timestamp: new Date().toISOString(),
                isRead: false,
                type: 'info'
            },
            {
                id: 2,
                title: 'Низкий уровень запасов',
                message: 'На складе осталось менее 5 единиц товара "Вафли Яшкино". Рекомендуется пополнить запасы.',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                isRead: false,
                type: 'warning'
            },
            {
                id: 3,
                title: 'Чек успешно обработан',
                message: 'Чек #12345 был успешно обработан и добавлен на склад.',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                isRead: true,
                type: 'success'
            },
            {
                id: 4,
                title: 'Ошибка синхронизации',
                message: 'Не удалось синхронизировать данные с внешней системой. Повторите попытку позже.',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                isRead: true,
                type: 'error'
            },
            {
                id: 5,
                title: 'Новые правила списания активированы',
                message: 'Автоматическое списание для 3 товаров было успешно настроено.',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                isRead: true,
                type: 'success'
            }
        ];
    }
}
