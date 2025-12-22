import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDropdownComponent, DropdownOption } from '../../shared/components/custom-dropdown/custom-dropdown.component';
import { NotificationsService } from './services/notifications.service';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, CustomDropdownComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  isLoading = signal<boolean>(false);
  filterType = signal<string>('all');

  filterOptions: DropdownOption[] = [
    { value: 'all', label: 'Показать все' },
    { value: 'unread', label: 'Непрочитанные' },
    { value: 'read', label: 'Прочитанные' }
  ];

  filteredNotifications = computed(() => {
    const all = this.notifications();
    const filter = this.filterType();

    if (filter === 'all') {
      return all;
    } else if (filter === 'unread') {
      return all.filter(n => !n.isRead);
    } else if (filter === 'read') {
      return all.filter(n => n.isRead);
    }
    return all;
  });

  unreadCount = computed(() => {
    return this.notifications().filter(n => !n.isRead).length;
  });

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading.set(true);
    this.notificationsService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications.set(notifications);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Ошибка загрузки уведомлений:', error);
        this.isLoading.set(false);
      }
    });
  }

  onFilterChange(value: string): void {
    this.filterType.set(value);
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationsService.markAsRead(notification.id).subscribe({
        next: () => {
          this.notifications.update(notifications =>
            notifications.map(n =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
        }
      });
    }
  }

  deleteNotification(id: number): void {
    this.notificationsService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications.update(notifications =>
          notifications.filter(n => n.id !== id)
        );
      }
    });
  }

  clearAll(): void {
    this.notificationsService.clearAllNotifications().subscribe({
      next: () => {
        this.notifications.set([]);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Только что';
    } else if (diffHours < 24) {
      return `${diffHours} ч. назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн. назад`;
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
  }

  getTypeIcon(type: Notification['type']): string {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  }

  getTypeClass(type: Notification['type']): string {
    return `notification-type-${type}`;
  }
}
