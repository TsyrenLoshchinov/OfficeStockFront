import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalStateService {
  private _openModalsCount = signal<number>(0);
  
  hasOpenModal = computed(() => this._openModalsCount() > 0);

  constructor() {
    // Автоматически блокируем/разблокируем скролл body при изменении количества модалок
    effect(() => {
      if (this.hasOpenModal()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  openModal(): void {
    this._openModalsCount.update(count => count + 1);
  }

  closeModal(): void {
    this._openModalsCount.update(count => Math.max(0, count - 1));
  }

  // Для обратной совместимости
  setModalOpen(isOpen: boolean): void {
    if (isOpen) {
      this.openModal();
    } else {
      this.closeModal();
    }
  }
}

