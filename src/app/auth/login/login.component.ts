import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginPayload } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginPayload = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Роутинг по роли
        this.redirectByRole(response.role);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Ошибка входа. Проверьте username и пароль.';
      }
    });
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'hr-manager':
        this.router.navigate(['/hr/receipts']);
        break;
      case 'economist':
        this.router.navigate(['/economist/analytics']);
        break;
      case 'director':
        this.router.navigate(['/director/reports']);
        break;
      case 'admin':
        this.router.navigate(['/admin/users']);
        break;
      default:
        this.router.navigate(['/hr/receipts']);
    }
  }
}

