import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserRead } from '../../core/services/users.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile = signal<UserRead | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.authService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Ошибка загрузки профиля:', error);
        this.error.set('Ошибка при загрузке данных профиля');
        this.isLoading.set(false);
      }
    });
  }

  getFullName(): string {
    const profile = this.profile();
    return profile?.name || 'Пользователь';
  }

  getPosition(): string {
    // Всегда используем роль для отображения должности
    return this.getRoleLabel();
  }

  getRoleLabel(): string {
    const profile = this.profile();
    const roleMap: Record<string, string> = {
      'admin': 'Администратор',
      'hr-manager': 'HR-менеджер',
      'economist': 'Экономист',
      'director': 'Директор'
    };
    
    // Используем role_name из профиля, если он есть
    let role = profile?.role_name;
    
    // Если role_name нет в профиле, используем роль из сохраненного пользователя при авторизации
    if (!role) {
      const currentUser = this.authService.getUser();
      role = currentUser?.role || null;
    }
    
    // Нормализуем роль к нижнему регистру для поиска в маппинге
    if (role) {
      const normalizedRole = role.toLowerCase().trim();
      const mappedRole = roleMap[normalizedRole];
      if (mappedRole) {
        return mappedRole;
      }
      // Если роль не найдена в маппинге, возвращаем роль как есть
      return role;
    }
    
    return 'Сотрудник';
  }

  getEmail(): string {
    const profile = this.profile();
    return profile?.email || '';
  }
}
