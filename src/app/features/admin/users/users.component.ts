import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService, Employee } from '../../../core/services/users.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  employees = signal<Employee[]>([]);
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  showErrorModal = signal(false);
  errorMessage = signal('');
  selectedEmployee: Employee | null = null;
  filterRole = signal<UserRole | 'all'>('all');
  
  addForm: FormGroup;
  editForm: FormGroup;

  roles: UserRole[] = ['admin', 'hr-manager', 'economist', 'director'];
  roleLabels: Record<UserRole, string> = {
    'admin': 'Администратор',
    'hr-manager': 'HR-менеджер',
    'economist': 'Экономист',
    'director': 'Директор'
  };

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {
    this.addForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: [''],
      generatePassword: [false]
    });

    this.editForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: [''],
      generatePassword: [false]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employees.set([...this.usersService.getEmployees()]);
    this.applyFilter();
  }

  applyFilter(): void {
    const allEmployees = this.usersService.getEmployees();
    if (this.filterRole() === 'all') {
      this.employees.set([...allEmployees]);
    } else {
      this.employees.set(allEmployees.filter(emp => emp.role === this.filterRole()));
    }
  }

  onFilterChange(role: UserRole | 'all'): void {
    this.filterRole.set(role);
    this.applyFilter();
  }

  openAddModal(): void {
    this.addForm.reset({
      generatePassword: false
    });
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.addForm.reset();
  }

  async onAddSubmit(): Promise<void> {
    if (this.addForm.invalid) return;

    const formValue = this.addForm.value;
    const employee: Omit<Employee, 'id'> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      middleName: formValue.middleName || undefined,
      email: formValue.email,
      role: formValue.role,
      password: formValue.generatePassword ? this.generatePassword() : formValue.password
    };

    const success = await this.usersService.addEmployee(employee);
    if (success) {
      this.loadEmployees();
      this.closeAddModal();
    } else {
      this.errorMessage.set(`Пользователь с почтой ${formValue.email} уже существует`);
      this.showErrorModal.set(true);
    }
  }

  openEditModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.editForm.patchValue({
      lastName: employee.lastName,
      firstName: employee.firstName,
      middleName: employee.middleName || '',
      email: employee.email,
      role: employee.role,
      password: '',
      generatePassword: false
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedEmployee = null;
    this.editForm.reset();
  }

  onEditSubmit(): void {
    if (this.editForm.invalid || !this.selectedEmployee) return;

    const formValue = this.editForm.value;
    const updates: Partial<Employee> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      middleName: formValue.middleName || undefined,
      email: formValue.email,
      role: formValue.role
    };

    if (formValue.generatePassword || formValue.password) {
      updates.password = formValue.generatePassword ? this.generatePassword() : formValue.password;
    }

    this.usersService.updateEmployee(this.selectedEmployee.id, updates);
    this.loadEmployees();
    this.closeEditModal();
  }

  openDeleteModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedEmployee = null;
  }

  onDeleteConfirm(): void {
    if (this.selectedEmployee) {
      this.usersService.deleteEmployee(this.selectedEmployee.id);
      this.loadEmployees();
      this.closeDeleteModal();
    }
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
    this.errorMessage.set('');
  }

  getFullName(employee: Employee): string {
    return `${employee.lastName} ${employee.firstName}${employee.middleName ? ' ' + employee.middleName : ''}`;
  }

  getRoleLabel(role: UserRole): string {
    return this.roleLabels[role] || role;
  }

  private generatePassword(): string {
    return Math.random().toString(36).slice(-8) + '_i';
  }
}
