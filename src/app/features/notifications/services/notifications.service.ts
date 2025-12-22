import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Notification, NotificationApiResponse, mapNotificationFromApi } from '../../../core/models/notification.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { WarehouseService } from '../../warehouse/services/warehouse.service';

@Injectable({
    providedIn: 'root'
})
@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private readonly READ_KEY = 'notifications_read';
    private readonly DELETED_KEY = 'notifications_deleted';

    constructor(
        private warehouseService: WarehouseService
    ) { }

    getNotifications(): Observable<Notification[]> {
        return this.warehouseService.getWarehouseItems().pipe(
            map(items => {
                const notifications: Notification[] = [];
                const readIds = this.getStoredIds(this.READ_KEY);
                const deletedIds = this.getStoredIds(this.DELETED_KEY);

                // Generate Low Stock Notifications
                items.forEach(item => {
                    if (item.quantity < 5) {
                        const notifId = 1000 + item.id; // Offset ID to avoid collisions if we add more sources

                        if (deletedIds.includes(notifId)) return;

                        notifications.push({
                            id: notifId,
                            title: 'Низкий уровень запасов',
                            message: `На складе осталось мало товара "${item.name}" (${item.quantity} шт.). Рекомендуется пополнить запасы.`,
                            timestamp: new Date().toISOString(), // In real app, maybe track when it became low? For now, "now".
                            isRead: readIds.includes(notifId),
                            type: 'warning'
                        });
                    }
                });

                // We can add other sources here later (e.g. from Receipts)

                return notifications.sort((a, b) => {
                    // Sort by read status (unread first), then by ID or mock timestamp
                    if (a.isRead === b.isRead) return 0;
                    return a.isRead ? 1 : -1;
                });
            }),
            catchError(error => {
                console.error('Error generating notifications:', error);
                return of([]);
            })
        );
    }

    markAsRead(notificationId: number): Observable<void> {
        const readIds = this.getStoredIds(this.READ_KEY);
        if (!readIds.includes(notificationId)) {
            readIds.push(notificationId);
            localStorage.setItem(this.READ_KEY, JSON.stringify(readIds));
        }
        return of(void 0);
    }

    deleteNotification(notificationId: number): Observable<void> {
        const deletedIds = this.getStoredIds(this.DELETED_KEY);
        if (!deletedIds.includes(notificationId)) {
            deletedIds.push(notificationId);
            localStorage.setItem(this.DELETED_KEY, JSON.stringify(deletedIds));
        }
        return of(void 0);
    }

    clearAllNotifications(): Observable<void> {
        // In this local-gen architecture, 'clear' might mean 'mark all current as deleted'
        // But that's expensive/complex to correct if stock changes. 
        // Let's just ignore for now or implement if needed.
        return of(void 0);
    }

    private getStoredIds(key: string): number[] {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }
}
