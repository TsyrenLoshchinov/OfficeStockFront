export interface NotificationApiResponse {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    is_read: boolean;
    type: 'info' | 'warning' | 'success' | 'error';
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: 'info' | 'warning' | 'success' | 'error';
}

export function mapNotificationFromApi(api: NotificationApiResponse): Notification {
    return {
        id: api.id,
        title: api.title,
        message: api.message,
        timestamp: api.timestamp,
        isRead: api.is_read,
        type: api.type
    };
}
