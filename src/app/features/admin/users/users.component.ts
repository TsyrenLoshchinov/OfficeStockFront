import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService, Employee } from '../../../core/services/users.service';
import { UserRole } from '../../../core/models/user.model';
import { CustomDropdownComponent, DropdownOption } from '../../../shared/components/custom-dropdown/custom-dropdown.component';
import { ModalStateService } from '../../../core/services/modal-state.service';
import { ModalContainerDirective } from '../../../shared/directives/modal-container.directive';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomDropdownComponent, ModalContainerDirective],
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
  showPasswordAdd = signal(true);
  showPasswordEdit = signal(true);

  addForm: FormGroup;
  editForm: FormGroup;

  roles: UserRole[] = ['admin', 'hr-manager', 'economist', 'director'];
  roleLabels: Record<UserRole, string> = {
    'admin': 'Администратор',
    'hr-manager': 'HR-менеджер',
    'economist': 'Экономист',
    'director': 'Директор'
  };

  filterOptions: DropdownOption[] = [
    { value: 'all', label: 'Все сотрудники' },
    { value: 'hr-manager', label: 'HR-менеджер' },
    { value: 'economist', label: 'Экономист' },
    { value: 'director', label: 'Директор' },
    { value: 'admin', label: 'Администратор' }
  ];

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private modalStateService: ModalStateService
  ) {
    this.addForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      role: ['', Validators.required],
      password: [''],
      generatePassword: [false]
    });

    // Валидация пароля: если generatePassword = false, то пароль обязателен
    this.addForm.get('generatePassword')?.valueChanges.subscribe(generate => {
      const passwordControl = this.addForm.get('password');
      if (!generate) {
        passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        passwordControl?.clearValidators();
        passwordControl?.setValue('');
      }
      passwordControl?.updateValueAndValidity();
    });

    this.editForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      role: ['', Validators.required],
      password: [''],
      generatePassword: [false]
    });

    // Валидация пароля для редактирования: если generatePassword = false и пароль указан, то проверяем длину
    this.editForm.get('generatePassword')?.valueChanges.subscribe(generate => {
      const passwordControl = this.editForm.get('password');
      if (!generate && passwordControl?.value) {
        passwordControl?.setValidators([Validators.minLength(6)]);
      } else {
        passwordControl?.clearValidators();
        if (generate) {
          passwordControl?.setValue('');
        }
      }
      passwordControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.usersService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Ошибка загрузки сотрудников:', error);
        this.errorMessage.set('Ошибка при загрузке списка сотрудников');
        this.showErrorModal.set(true);
      }
    });
  }

  applyFilter(): void {
    this.usersService.getEmployees().subscribe({
      next: (allEmployees) => {
        if (this.filterRole() === 'all') {
          this.employees.set([...allEmployees]);
        } else {
          this.employees.set(allEmployees.filter(emp => emp.role === this.filterRole()));
        }
      },
      error: (error) => {
        console.error('Ошибка фильтрации:', error);
      }
    });
  }

  onFilterChange(role: string): void {
    this.filterRole.set(role as UserRole | 'all');
    this.applyFilter();
  }

  openAddModal(): void {
    this.addForm.reset({
      lastName: '',
      firstName: '',
      middleName: '',
      email: '',
      role: '',
      password: '',
      generatePassword: false
    });
    // Устанавливаем валидацию пароля по умолчанию
    this.addForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.addForm.get('password')?.updateValueAndValidity();
    this.showPasswordAdd.set(true);
    this.showAddModal.set(true);
    this.modalStateService.openModal();
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.addForm.reset();
    this.modalStateService.closeModal();
  }

  onAddSubmit(): void {
    if (this.addForm.invalid) {
      // Помечаем все поля как touched для отображения ошибок
      Object.keys(this.addForm.controls).forEach(key => {
        this.addForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.addForm.value;
    const employee: Omit<Employee, 'id'> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      middleName: formValue.middleName || undefined,
      email: formValue.email.toLowerCase(),
      role: formValue.role,
      password: formValue.generatePassword ? formValue.password : formValue.password
    };

    this.usersService.addEmployee(employee).subscribe({
      next: () => {
        this.loadEmployees();
        this.closeAddModal();
      },
      error: (error) => {
        console.error('Ошибка добавления сотрудника:', error);
        this.errorMessage.set(this.extractErrorMessage(error, `Пользователь с почтой ${formValue.email} уже существует`));
        this.showErrorModal.set(true);
        this.modalStateService.openModal();
      }
    });
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
    this.showPasswordEdit.set(true);
    this.showEditModal.set(true);
    this.modalStateService.openModal();
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedEmployee = null;
    this.editForm.reset();
    this.modalStateService.closeModal();
  }

  onEditSubmit(): void {
    if (this.editForm.invalid || !this.selectedEmployee) {
      if (this.editForm.invalid) {
        // Помечаем все поля как touched для отображения ошибок
        Object.keys(this.editForm.controls).forEach(key => {
          this.editForm.get(key)?.markAsTouched();
        });
      }
      return;
    }

    const formValue = this.editForm.value;
    const updates: Partial<Employee> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      middleName: formValue.middleName || undefined,
      email: formValue.email.toLowerCase(),
      role: formValue.role
    };

    // Сначала обновляем данные сотрудника
    this.usersService.updateEmployee(this.selectedEmployee.id, updates).subscribe({
      next: () => {
        console.log('Данные сотрудника обновлены успешно');
        // Если пароль указан (независимо от чекбокса), обновляем его
        if (formValue.password && formValue.password.trim() !== '') {
          console.log('Обновление пароля...');
          this.usersService.changePassword(this.selectedEmployee!.id, formValue.password).subscribe({
            next: () => {
              console.log('Пароль обновлен успешно');
              this.loadEmployees();
              this.closeEditModal();
            },
            error: (error) => {
              console.error('Ошибка изменения пароля:', error);
              this.errorMessage.set(this.extractErrorMessage(error, 'Ошибка при изменении пароля'));
              this.showErrorModal.set(true);
            }
          });
        } else {
          // Если пароль не указан, просто обновляем список
          this.loadEmployees();
          this.closeEditModal();
        }
      },
      error: (error) => {
        console.error('Ошибка обновления сотрудника:', error);
        this.errorMessage.set(this.extractErrorMessage(error, 'Ошибка при обновлении данных сотрудника'));
        this.showErrorModal.set(true);
        this.modalStateService.openModal();
      }
    });
  }

  openDeleteModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showDeleteModal.set(true);
    this.modalStateService.openModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedEmployee = null;
    this.modalStateService.closeModal();
  }

  onDeleteConfirm(): void {
    if (this.selectedEmployee) {
      this.usersService.deleteEmployee(this.selectedEmployee.id).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Ошибка удаления сотрудника:', error);
          this.errorMessage.set('Ошибка при удалении сотрудника');
          this.showErrorModal.set(true);
          this.modalStateService.openModal();
        }
      });
    }
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
    this.errorMessage.set('');
    this.modalStateService.closeModal();
  }

  getFullName(employee: Employee): string {
    return `${employee.lastName} ${employee.firstName}${employee.middleName ? ' ' + employee.middleName : ''}`;
  }

  getRoleLabel(role: UserRole): string {
    return this.roleLabels[role] || role;
  }

  private generatePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  onGeneratePasswordChange(isGenerate: boolean, formType: 'add' | 'edit'): void {
    const form = formType === 'add' ? this.addForm : this.editForm;
    const passwordControl = form.get('password');

    if (isGenerate) {
      const generatedPassword = this.generatePassword();
      passwordControl?.setValue(generatedPassword);
      passwordControl?.clearValidators();
      passwordControl?.updateValueAndValidity();
    } else {
      passwordControl?.setValue('');
      if (formType === 'add') {
        passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        passwordControl?.clearValidators();
      }
      passwordControl?.updateValueAndValidity();
    }
  }

  getFieldError(fieldName: string, formType: 'add' | 'edit' = 'add'): string {
    const form = formType === 'add' ? this.addForm : this.editForm;
    const control = form.get(fieldName);

    if (control?.hasError('required')) {
      return 'Это поле обязательно для заполнения';
    }
    if (control?.hasError('email')) {
      return 'Введите корректный email';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Минимальная длина: ${requiredLength} символов`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `Максимальная длина: ${maxLength} символов`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string, formType: 'add' | 'edit' = 'add'): boolean {
    const form = formType === 'add' ? this.addForm : this.editForm;
    const control = form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  togglePasswordVisibility(formType: 'add' | 'edit'): void {
    if (formType === 'add') {
      this.showPasswordAdd.update(value => !value);
    } else {
      this.showPasswordEdit.update(value => !value);
    }
  }

  private extractErrorMessage(error: any, defaultMessage: string): string {
    if (!error) return defaultMessage;

    // Try to get error from error.error
    const errorBody = error.error;
    if (!errorBody) return error.message || defaultMessage;

    // If errorBody is a string, return it
    if (typeof errorBody === 'string') return errorBody;

    // If it's an object, try common fields
    if (typeof errorBody === 'object') {
      // Try detail field
      if (errorBody.detail) {
        if (typeof errorBody.detail === 'string') return errorBody.detail;
        if (Array.isArray(errorBody.detail) && errorBody.detail.length > 0) {
          const first = errorBody.detail[0];
          if (typeof first === 'string') return first;
          if (first.msg) return first.msg;
        }
        return JSON.stringify(errorBody.detail);
      }
      // Try message field
      if (typeof errorBody.message === 'string') return errorBody.message;
      // Try msg field
      if (typeof errorBody.msg === 'string') return errorBody.msg;
    }

    return defaultMessage;
  }
}
