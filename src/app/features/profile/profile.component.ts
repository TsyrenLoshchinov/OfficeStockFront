import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  getFullName(): string {
    // Маппинг username на ФИО (можно расширить модель User)
    const usernameMap: Record<string, string> = {
      'admin': 'Администратор Системы',
      'hr-manager': 'Иванов Иван Иванович',
      'economist': 'Петрова Мария Сергеевна',
      'director': 'Сидоров Петр Александрович'
    };
    return usernameMap[this.user?.username || ''] || this.user?.username || 'Пользователь';
  }

  getPosition(): string {
    const roleMap: Record<string, string> = {
      'admin': 'Администратор',
      'hr-manager': 'HR-менеджер',
      'economist': 'Экономист',
      'director': 'Директор'
    };
    return roleMap[this.user?.role || ''] || 'Сотрудник';
  }

  getEmail(): string {
    // Маппинг username на email
    const emailMap: Record<string, string> = {
      'admin': 'admin@officestock.com',
      'hr-manager': 'iiivanov@pochta.com',
      'economist': 'petrova@pochta.com',
      'director': 'sidorov@pochta.com'
    };
    return emailMap[this.user?.username || ''] || `${this.user?.username || 'user'}@pochta.com`;
  }
}
