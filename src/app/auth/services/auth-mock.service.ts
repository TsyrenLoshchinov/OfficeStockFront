import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, delay, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginPayload, LoginResponse, UserRole, User } from '../../core/models/user.model';

/**
 * Mock-сервис для авторизации (для разработки без бэкенда)
 * 
 * Тестовые данные для входа:
 * 
 * HR-менеджер:
 *   Логин: hr_manager
 *   Пароль: hr123
 * 
 * Экономист:
 *   Логин: economist
 *   Пароль: econ123
 * 
 * Директор:
 *   Логин: director
 *   Пароль: dir123
 * 
 * Администратор:
 *   Логин: admin
 *   Пароль: admin123
 */
@Injectable({
  providedIn: 'root'
})
export class AuthMockService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly USER_KEY = 'user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Тестовые пользователи
  private readonly mockUsers = [
    {
      login: 'hr_manager',
      password: 'hr123',
      role: 'hr-manager' as UserRole,
      userId: 1,
      username: 'HR Менеджер'
    },
    {
      login: 'economist',
      password: 'econ123',
      role: 'economist' as UserRole,
      userId: 2,
      username: 'Экономист'
    },
    {
      login: 'director',
      password: 'dir123',
      role: 'director' as UserRole,
      userId: 3,
      username: 'Директор'
    },
    {
      login: 'admin',
      password: 'admin123',
      role: 'admin' as UserRole,
      userId: 4,
      username: 'Администратор'
    }
  ];

  constructor(private router: Router) {}

  login(credentials: LoginPayload): Observable<LoginResponse> {
    const user = this.mockUsers.find(
      u => u.login === credentials.login && u.password === credentials.password
    );

    if (!user) {
      throw { error: { message: 'Неверный логин или пароль' } };
    }

    const response: LoginResponse = {
      accessToken: `mock_token_${user.userId}_${Date.now()}`,
      role: user.role,
      userId: user.userId,
      username: user.username
    };

    // Имитация задержки сети
    return of(response).pipe(
      delay(500),
      tap(response => {
        this.setToken(response.accessToken);
        const userData: User = {
          userId: response.userId,
          username: response.username,
          role: response.role
        };
        this.setUser(userData);
        this.currentUserSubject.next(userData);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRole(): UserRole | null {
    const user = this.getUserFromStorage();
    return user?.role || null;
  }

  getUser(): User | null {
    return this.getUserFromStorage();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  hasRole(role: UserRole): boolean {
    return this.getRole() === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getRole();
    return userRole ? roles.includes(userRole) : false;
  }
}

