import { Component, Input, Output, EventEmitter, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css']
})
export class CustomDropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() selectedValue: string = '';
  @Input() placeholder: string = '';
  @Input() width: string = '305px';
  @Input() height: string = '44px';
  @Input() menuLeft: string = '73px';
  @Input() menuTop: string = '52px';
  @Input() menuWidth: string = '212px';
  @Output() valueChange = new EventEmitter<string>();

  isOpen = signal<boolean>(false);

  get selectedLabel(): string {
    const option = this.options.find(opt => opt.value === this.selectedValue);
    return option ? option.label : this.placeholder;
  }

  toggleDropdown(): void {
    this.isOpen.update(value => !value);
  }

  selectOption(value: string): void {
    if (value !== this.selectedValue) {
      this.valueChange.emit(value);
    }
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.isOpen.set(false);
    }
  }
}
