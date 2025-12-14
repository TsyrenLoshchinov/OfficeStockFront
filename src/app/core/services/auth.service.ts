import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { LoginPayload, LoginResponse, LoginResponseBackend, UserRole, User } from '../models/user.model';
import { ApiService } from './api.service';
import { UserRead } from './users.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly USER_KEY = 'user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {}

  login(credentials: LoginPayload): Observable<LoginResponse> {
    // Подготавливаем данные в формате application/x-www-form-urlencoded
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', credentials.username)
      .set('password', credentials.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    });

    return this.http.post<LoginResponseBackend>(
      `${this.apiService.getBaseUrl()}/auth/login`,
      body.toString(),
      { headers }
    )
      .pipe(
        map((backendResponse: LoginResponseBackend) => {
          // Преобразуем ответ от бэкенда (snake_case) в наш формат (camelCase)
          return {
            accessToken: backendResponse.access_token,
            role: backendResponse.role,
            userId: backendResponse.user_id,
            username: backendResponse.user_name
          } as LoginResponse;
        }),
        tap(response => {
          this.setToken(response.accessToken);
          const user: User = {
            userId: response.userId,
            username: response.username,
            role: response.role
          };
          this.setUser(user);
          this.currentUserSubject.next(user);
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

  getCurrentUserProfile(): Observable<UserRead> {
    if (environment.useMockAuth) {
      const user = this.getUser();
      const mockProfile: UserRead = {
        id: user?.userId || 1,
        email: `${user?.username || 'user'}@pochta.com`,
        name: user?.username || 'Пользователь',
        position: null,
        role_name: user?.role || 'hr-manager',
        role_id: null,
        is_active: true,
        is_superuser: user?.role === 'admin',
        is_verified: false
      };
      return new Observable(observer => {
        observer.next(mockProfile);
        observer.complete();
      });
    }

    return this.http.get<any>(`${this.apiService.getBaseUrl()}/users/me`).pipe(
      map((response) => {
        // Маппим ответ API в формат UserRead
        // API может возвращать либо { user_id, user_name, email, role, is_superuser }
        // либо { id, name, email, role_name, ... }
        if (response.user_id !== undefined) {
          // Формат: { user_id, user_name, email, role, is_superuser }
          return {
            id: response.user_id,
            email: response.email,
            name: response.user_name,
            position: null,
            role_name: response.role, // Маппим role в role_name
            role_id: null,
            is_active: true,
            is_superuser: response.is_superuser,
            is_verified: false
          } as UserRead;
        } else if (response.id !== undefined) {
          // Формат: { id, name, email, role_name, ... }
          return response as UserRead;
        } else {
          // Если формат неизвестен, пытаемся использовать как есть
          return response as UserRead;
        }
      })
    );
  }

  updateCurrentUserProfile(updates: Partial<UserRead>): Observable<UserRead> {
    if (environment.useMockAuth) {
      const user = this.getUser();
      const updatedProfile: UserRead = {
        id: user?.userId || 1,
        email: updates.email || `${user?.username || 'user'}@pochta.com`,
        name: updates.name || user?.username || 'Пользователь',
        position: updates.position || null,
        role_name: updates.role_name || user?.role || 'hr-manager',
        role_id: updates.role_id || null,
        is_active: updates.is_active !== undefined ? updates.is_active : true,
        is_superuser: updates.is_superuser !== undefined ? updates.is_superuser : user?.role === 'admin',
        is_verified: updates.is_verified !== undefined ? updates.is_verified : false
      };
      return new Observable(observer => {
        observer.next(updatedProfile);
        observer.complete();
      });
    }

    return this.http.patch<UserRead>(`${this.apiService.getBaseUrl()}/users/me`, updates);
  }
}

