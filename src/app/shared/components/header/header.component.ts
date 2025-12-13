import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ModalStateService } from '../../../core/services/modal-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  notificationCount = 0;
  currentUser$ = this.authService.currentUser$;
  hasOpenModal = this.modalStateService.hasOpenModal;
  isSidebarOpen = false;
  private intervalId?: number;

  constructor(
    private authService: AuthService,
    private modalStateService: ModalStateService
  ) {}

  ngOnInit(): void {
    this.checkSidebarState();
    // Проверяем состояние сайдбара периодически
    this.intervalId = window.setInterval(() => this.checkSidebarState(), 100);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private checkSidebarState(): void {
    const sidebar = document.querySelector('.sidebar[data-open="true"]');
    this.isSidebarOpen = !!sidebar;
  }

  getUsername(): string {
    const user = this.authService.getUser();
    return user?.username || 'Пользователь';
  }
}

