import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginPayload, LoginResponse, UserRole, User } from '../../core/models/user.model';
import { ApiService } from '../../core/services/api.service';

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
    return this.http.post<LoginResponse>(`${this.apiService.getBaseUrl()}/auth/login`, credentials)
      .pipe(
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
}

