import { Component, computed, signal } from '@angular/core';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class NotificationsPage {
  protected readonly notifications = computed(() => this.notificationService.getNotifications()());
  protected readonly filter = signal<'all' | 'unread' | 'read'>('all');

  constructor(private readonly notificationService: NotificationService) {}

  protected filteredNotifications() {
    const list = this.notifications();
    if (this.filter() === 'all') {
      return list;
    }
    if (this.filter() === 'unread') {
      return list.filter((n) => !n.read);
    }
    return list.filter((n) => n.read);
  }

  protected onFilterChange(value: string): void {
    this.filter.set(value as 'all' | 'unread' | 'read');
  }

  protected deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id);
  }

  protected clearAll(): void {
    this.notificationService.clearAll();
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }
}

