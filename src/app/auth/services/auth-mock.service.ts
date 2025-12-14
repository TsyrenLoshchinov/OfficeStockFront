import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, delay, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { LoginPayload, LoginResponse, LoginResponseBackend, UserRole, User } from '../../core/models/user.model';

/**
 * Mock-сервис для авторизации (для разработки без бэкенда)
 * 
 * Тестовые данные для входа:
 * 
 * HR-менеджер:
 *   Username: hr_manager
 *   Пароль: hr123
 * 
 * Экономист:
 *   Username: economist
 *   Пароль: econ123
 * 
 * Директор:
 *   Username: director
 *   Пароль: dir123
 * 
 * Администратор:
 *   Username: admin
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
      username: 'hr_manager',
      password: 'hr123',
      role: 'hr-manager' as UserRole,
      userId: 1,
      user_name: 'HR Менеджер'
    },
    {
      username: 'economist',
      password: 'econ123',
      role: 'economist' as UserRole,
      userId: 2,
      user_name: 'Экономист'
    },
    {
      username: 'director',
      password: 'dir123',
      role: 'director' as UserRole,
      userId: 3,
      user_name: 'Директор'
    },
    {
      username: 'admin',
      password: 'admin123',
      role: 'admin' as UserRole,
      userId: 4,
      user_name: 'Администратор'
    }
  ];

  constructor(private router: Router) {}

  login(credentials: LoginPayload): Observable<LoginResponse> {
    const user = this.mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw { error: { message: 'Неверный username или пароль' } };
    }

    // Имитируем ответ от бэкенда в формате snake_case
    const backendResponse: LoginResponseBackend = {
      user_id: user.userId,
      user_name: user.user_name,
      role: user.role,
      access_token: `mock_token_${user.userId}_${Date.now()}`
    };

    // Имитация задержки сети и преобразование в camelCase
    return of(backendResponse).pipe(
      delay(500),
      map((backendResponse: LoginResponseBackend) => {
        return {
          accessToken: backendResponse.access_token,
          role: backendResponse.role,
          userId: backendResponse.user_id,
          username: backendResponse.user_name
        } as LoginResponse;
      }),
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

