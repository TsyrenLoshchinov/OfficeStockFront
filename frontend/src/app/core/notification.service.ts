import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  text: string;
  date: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notifications = signal<Notification[]>([
    {
      id: '1',
      title: 'Нужно купить Эзену сушняк',
      text: 'На складе осталось 0 бутылкок энергоса.',
      date: new Date('2025-10-19'),
      read: true,
    },
    {
      id: '2',
      title: 'Необходимо пополнить запасы',
      text: 'На складе осталось 4 бутылки пива. Нужно пополнить запасы',
      date: new Date('2025-10-19'),
      read: false,
    },
    {
      id: '3',
      title: 'Нужны купить сиги',
      text: 'На складе осталось 4 пачки сигарет. Нужно пополнить запасы',
      date: new Date('2025-10-19'),
      read: false,
    },
    {
      id: '4',
      title: 'Срочно купить 3л воды',
      text: 'Срочно оформить заказ у поставщика "АкваСервис" на 200 единиц продукции. Для этого необходимо выполнить следующие действия: перейти в раздел "Закупки" в системе электронного документооборота, выбрать поставщика "АкваСервис" из списка approved vendors, заполнить форму заказа с указанием артикулов продукции, согласовать заявку с финансовым отделом',
      date: new Date('2025-10-19'),
      read: true,
    },
    {
      id: '5',
      title: 'Срочно купить 3л воды',
      text: 'Срочно оформить заказ у поставщика "АкваСервис" на 200 единиц продукции. Для этого необходимо выполнить следующие действия: перейти в раздел "Закупки" в системе электронного документооборота, выбрать поставщика "АкваСервис" из списка approved vendors, заполнить форму заказа с указанием артикулов продукции, согласовать заявку с финансовым отделом',
      date: new Date('2025-10-19'),
      read: true,
    },
    {
      id: '6',
      title: 'Срочно купить 3л воды',
      text: 'Срочно оформить заказ у поставщика "АкваСервис" на 200 единиц продукции. Для этого необходимо выполнить следующие действия: перейти в раздел "Закупки" в системе электронного документооборота, выбрать поставщика "АкваСервис" из списка approved vendors, заполнить форму заказа с указанием артикулов продукции, согласовать заявку с финансовым отделом',
      date: new Date('2025-10-19'),
      read: true,
    },
  ]);

  getNotifications() {
    return this.notifications.asReadonly();
  }

  getUnreadCount(): number {
    return this.notifications().filter((n) => !n.read).length;
  }

  markAsRead(id: string): void {
    this.notifications.update((notifications) =>
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllAsRead(): void {
    this.notifications.update((notifications) =>
      notifications.map((n) => ({ ...n, read: true }))
    );
  }

  deleteNotification(id: string): void {
    this.notifications.update((notifications) =>
      notifications.filter((n) => n.id !== id)
    );
  }

  clearAll(): void {
    this.notifications.set([]);
  }
}

