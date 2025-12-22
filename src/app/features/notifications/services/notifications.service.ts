import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification, NotificationSchema, mapNotificationFromSchema } from '../../../core/models/notification.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService implements OnDestroy {
    private readonly STORAGE_KEY = 'user_notifications';
    private socket: WebSocket | null = null;
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);

    public notifications$ = this.notificationsSubject.asObservable();

    constructor(private apiService: ApiService) {
        this.loadFromStorage();
        this.connect();
    }

    private loadFromStorage(): void {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const notifications: Notification[] = JSON.parse(data);
                this.notificationsSubject.next(notifications);
            }
        } catch (e) {
            console.error('Failed to load notifications from storage', e);
        }
    }

    private saveToStorage(notifications: Notification[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
        } catch (e) {
            console.error('Failed to save notifications to storage', e);
        }
    }

    private connect(): void {
        // Build WS URL from ApiService base URL
        // ApiService usually returns 'https://domain/api/v1'. We need 'wss://domain/api/v1/notifications/ws'
        const httpUrl = this.apiService.getBaseUrl();
        const wsUrl = httpUrl.replace(/^http/, 'ws') + '/notifications/ws';

        console.log('Connecting to Notification WebSocket:', wsUrl);

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as NotificationSchema;
                this.handleNotification(data);
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
            }
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed', event);
            // Simple reconnect logic
            setTimeout(() => this.connect(), 5000);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.socket?.close();
        };
    }

    private handleNotification(schema: NotificationSchema): void {
        const newNotification = mapNotificationFromSchema(schema);
        const current = this.notificationsSubject.value;
        const updated = [newNotification, ...current];

        // Limit storage to say 50 items
        if (updated.length > 50) {
            updated.length = 50;
        }

        this.notificationsSubject.next(updated);
        this.saveToStorage(updated);
    }

    getNotifications(): Observable<Notification[]> {
        return this.notifications$;
    }

    markAsRead(id: number): Observable<void> {
        const current = this.notificationsSubject.value;
        const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
        this.notificationsSubject.next(updated);
        this.saveToStorage(updated);
        return of(void 0);
    }

    deleteNotification(id: number): Observable<void> {
        const current = this.notificationsSubject.value;
        const updated = current.filter(n => n.id !== id);
        this.notificationsSubject.next(updated);
        this.saveToStorage(updated);
        return of(void 0);
    }

    clearAllNotifications(): Observable<void> {
        this.notificationsSubject.next([]);
        this.saveToStorage([]);
        return of(void 0);
    }

    ngOnDestroy(): void {
        this.socket?.close();
    }
}
