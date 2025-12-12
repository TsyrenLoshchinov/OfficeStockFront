import { Injectable, signal } from '@angular/core';
import { UserRole } from '../models/user.model';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: UserRole;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly employees = signal<Employee[]>([
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
  ]);

  getEmployees(): readonly Employee[] {
    return this.employees();
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees().find(emp => emp.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): Promise<boolean> {
    return new Promise((resolve) => {
      // Проверка на существующий email
      const exists = this.employees().some(emp => emp.email === employee.email);
      if (exists) {
        resolve(false);
        return;
      }

      const newId = String(this.employees().length + 1).padStart(3, '0');
      const newEmployee: Employee = {
        ...employee,
        id: newId
      };
      this.employees.update(employees => [...employees, newEmployee]);
      resolve(true);
    });
  }

  updateEmployee(id: string, updates: Partial<Employee>): void {
    this.employees.update(employees =>
      employees.map(emp => emp.id === id ? { ...emp, ...updates } : emp)
    );
  }

  deleteEmployee(id: string): void {
    this.employees.update(employees => employees.filter(emp => emp.id !== id));
  }
}

