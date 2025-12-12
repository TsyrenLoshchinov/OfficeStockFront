import { Component, computed } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage {
  protected readonly user = computed(() => this.authService.getCurrentUser()());

  constructor(private readonly authService: AuthService) {}

  protected updateProfile(name: string, position: string, email: string): void {
    this.authService.updateProfile({ name, position, email });
  }
}

