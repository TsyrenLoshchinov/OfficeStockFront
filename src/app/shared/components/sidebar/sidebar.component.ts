import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { ModalStateService } from '../../../core/services/modal-state.service';

interface MenuItem {
  label: string;
  route: string;
  roles: UserRole[];
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  currentRole: UserRole | null = null;
  hasOpenModal = this.modalStateService.hasOpenModal;

  menuItems: MenuItem[] = [
    { label: 'Главная', route: '/app', roles: ['hr-manager', 'admin'] },
    { label: 'Профиль', route: '/app/profile', roles: ['hr-manager', 'economist', 'director', 'admin'] },
    { label: 'Уведомления', route: '/app/notifications', roles: ['hr-manager', 'admin'] },
    { label: 'Чеки', route: '/app/receipts', roles: ['hr-manager', 'admin'] },
    { label: 'Категории', route: '/app/categories', roles: ['hr-manager', 'admin'] },
    { label: 'Склад', route: '/app/warehouse', roles: ['hr-manager', 'economist', 'director', 'admin'] },
    { label: 'Отчёты', route: '/app/reports', roles: ['economist', 'admin'] },
    { label: 'Администрирование', route: '/app/admin/users', roles: ['admin'] }
  ];

  filteredMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalStateService: ModalStateService
  ) { }

  ngOnInit(): void {
    this.currentRole = this.authService.getRole();
    this.filterMenuItems();
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  closeSidebar(): void {
    this.isOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }

  private filterMenuItems(): void {
    if (!this.currentRole) {
      this.filteredMenuItems = [];
      return;
    }

    this.filteredMenuItems = this.menuItems.filter(item =>
      item.roles.includes(this.currentRole!)
    );
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}

