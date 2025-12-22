import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { UserRole } from '../models/user.model';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: UserRole;
  password?: string;
}

// API interfaces
export interface UserRead {
  id: number;
  email: string;
  name: string;
  position?: string | null;
  role_name?: string | null;
  role_id?: number | null;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

export interface UserCreateAdmin {
  email: string;
  password: string;
  name: string;
  position?: string | null;
  role_name?: string | null;
  is_superuser?: boolean;
}

export interface UserUpdateAdmin {
  email?: string | null;
  name?: string | null;
  position?: string | null;
  is_superuser?: boolean;
  role_name?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  private mapUserReadToEmployee(user: UserRead): Employee {
    // Парсим имя: предполагаем формат "Фамилия Имя Отчество" или "Имя Фамилия"
    const nameParts = user.name.split(' ');
    let firstName = '';
    let lastName = '';
    let middleName = '';

    if (nameParts.length >= 2) {
      lastName = nameParts[0];
      firstName = nameParts[1];
      if (nameParts.length >= 3) {
        middleName = nameParts.slice(2).join(' ');
      }
    } else {
      firstName = user.name;
    }

    return {
      id: user.id.toString(),
      firstName,
      lastName,
      middleName: middleName || undefined,
      email: user.email,
      role: (user.role_name as UserRole) || 'hr-manager'
    };
  }

  private mapEmployeeToUserCreateAdmin(employee: Omit<Employee, 'id'>): UserCreateAdmin {
    const fullName = `${employee.lastName} ${employee.firstName}${employee.middleName ? ' ' + employee.middleName : ''}`;
    return {
      email: employee.email,
      password: employee.password || '',
      name: fullName.trim(),
      position: null,
      role_name: employee.role,
      is_superuser: employee.role === 'admin'
    };
  }

  getEmployees(): Observable<Employee[]> {
    if (environment.useMockAuth) {
      // Mock данные для разработки
      const mockEmployees: Employee[] = [
        {
          id: '001',
          firstName: 'Иван',
          lastName: 'Иванов',
          middleName: 'Иванович',
          email: 'iiivanov@pochta.com',
          role: 'hr-manager'
        },
        {
          id: '002',
          firstName: 'Мария',
          lastName: 'Петрова',
          middleName: 'Сергеевна',
          email: 'petrova@pochta.com',
          role: 'economist'
        },
        {
          id: '003',
          firstName: 'Петр',
          lastName: 'Сидоров',
          middleName: 'Александрович',
          email: 'sidorov@pochta.com',
          role: 'director'
        },
        {
          id: '004',
          firstName: 'Анна',
          lastName: 'Козлова',
          middleName: 'Владимировна',
          email: 'kozlova@pochta.com',
          role: 'hr-manager'
        }
      ];
      return of(mockEmployees).pipe(delay(300));
    }

    return this.http.get<UserRead[]>(`${this.apiService.getBaseUrl()}/admin/users/`).pipe(
      map(users => users.map(user => this.mapUserReadToEmployee(user)))
    );
  }

  getEmployeeById(id: string): Observable<Employee | undefined> {
    if (environment.useMockAuth) {
      const mockEmployees: Employee[] = [
        {
          id: '001',
          firstName: 'Иван',
          lastName: 'Иванов',
          middleName: 'Иванович',
          email: 'iiivanov@pochta.com',
          role: 'hr-manager'
        }
      ];
      return of(mockEmployees.find(emp => emp.id === id)).pipe(delay(200));
    }

    return this.http.get<UserRead>(`${this.apiService.getBaseUrl()}/admin/users/${id}`).pipe(
      map(user => this.mapUserReadToEmployee(user))
    );
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    if (environment.useMockAuth) {
      const newEmployee: Employee = {
        ...employee,
        id: String(Math.floor(Math.random() * 1000)).padStart(3, '0')
      };
      return of(newEmployee).pipe(delay(300));
    }

    const payload = this.mapEmployeeToUserCreateAdmin(employee);
    return this.http.post<UserRead>(`${this.apiService.getBaseUrl()}/admin/users/`, payload).pipe(
      map(user => this.mapUserReadToEmployee(user))
    );
  }

  updateEmployee(id: string, updates: Partial<Employee>): Observable<Employee> {
    if (environment.useMockAuth) {
      const updated: Employee = {
        id,
        firstName: updates.firstName || '',
        lastName: updates.lastName || '',
        middleName: updates.middleName,
        email: updates.email || '',
        role: updates.role || 'hr-manager'
      };
      return of(updated).pipe(delay(300));
    }

    const payload: UserUpdateAdmin = {
      email: updates.email ? updates.email.toLowerCase().trim() : undefined, // Нормализуем email к нижнему регистру
      name: updates.firstName && updates.lastName
        ? `${updates.lastName} ${updates.firstName}${updates.middleName ? ' ' + updates.middleName : ''}`.trim()
        : undefined,
      position: null,
      role_name: updates.role, // Отправляем роль
      is_superuser: updates.role === 'admin'
    };

    console.log('Отправка обновления сотрудника:', { id, payload });

    return this.http.patch<any>(`${this.apiService.getBaseUrl()}/admin/users/${id}`, payload).pipe(
      map((response) => {
        console.log('Ответ API при обновлении сотрудника:', response);
        // Маппим ответ API в формат UserRead
        let userRead: UserRead;
        if (response.user_id !== undefined) {
          // Формат: { user_id, user_name, email, role, is_superuser }
          userRead = {
            id: response.user_id,
            email: response.email,
            name: response.user_name,
            position: null,
            role_name: response.role,
            role_id: null,
            is_active: true,
            is_superuser: response.is_superuser,
            is_verified: false
          };
        } else if (response.id !== undefined) {
          // Формат: { id, name, email, role_name, ... }
          userRead = response as UserRead;
        } else {
          console.error('Неизвестный формат ответа API:', response);
          throw new Error('Неизвестный формат ответа API');
        }
        return this.mapUserReadToEmployee(userRead);
      })
    );
  }

  deleteEmployee(id: string): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    return this.http.delete<void>(`${this.apiService.getBaseUrl()}/admin/users/${id}`);
  }

  changePassword(userId: string, newPassword: string): Observable<void> {
    if (environment.useMockAuth) {
      return of(void 0).pipe(delay(200));
    }

    // API expects new_password as query parameter, not in body
    return this.http.post<void>(
      `${this.apiService.getBaseUrl()}/admin/users/${userId}/change-password?new_password=${encodeURIComponent(newPassword)}`,
      {}
    );
  }
}

