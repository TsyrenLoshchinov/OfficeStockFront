import { Component, signal, effect } from '@angular/core';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  protected readonly sidebarOpen = signal(false);
  protected readonly notificationCount = signal(0);

  constructor(private readonly notificationService: NotificationService) {
    effect(() => {
      this.notificationCount.set(this.notificationService.getUnreadCount());
    });
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
    document.body.style.overflow = this.sidebarOpen() ? 'hidden' : '';
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
    document.body.style.overflow = '';
  }
}
