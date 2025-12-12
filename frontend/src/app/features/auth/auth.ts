import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class AuthPage {
  login = '';
  password = '';

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  async signIn(): Promise<void> {
    const success = await this.auth.signIn(this.login, this.password);
    if (success) {
      this.router.navigate(['/home']);
    }
  }
}

