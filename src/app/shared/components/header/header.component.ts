import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  notificationCount = 0;
  currentUser$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}

  getUsername(): string {
    const user = this.authService.getUser();
    return user?.username || 'Пользователь';
  }
}

