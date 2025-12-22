export interface LowStockPayload {
    product_id: number;
    product_name?: string | null;
    current_stock: number;
    threshold: number;
    message: string;
}

export interface NotificationSchema {
    type: string;
    payload: any;
    timestamp: string;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: 'info' | 'warning' | 'success' | 'error';
    payload?: any; // To store raw payload if needed for specific logic
}

export function mapNotificationFromSchema(schema: NotificationSchema): Notification {
    // Generate a unique ID (based on timestamp usually, or random for now since backend doesn't send ID)
    const id = new Date(schema.timestamp).getTime() + Math.floor(Math.random() * 1000);

    let title = 'Уведомление';
    let message = '';
    let type: 'info' | 'warning' | 'success' | 'error' = 'info';

    if (schema.type === 'low_stock') {
        const payload = schema.payload as LowStockPayload;
        title = 'Низкий уровень запасов';
        message = payload.message || `Товар "${payload.product_name}" заканчивается (${payload.current_stock} шт.)`;
        type = 'warning';
    } else {
        message = JSON.stringify(schema.payload);
    }

    return {
        id,
        title,
        message,
        timestamp: schema.timestamp,
        isRead: false,
        type,
        payload: schema.payload
    };
}
