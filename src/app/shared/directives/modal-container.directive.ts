import { Directive, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appModalContainer]',
  standalone: true
})
export class ModalContainerDirective implements OnInit, OnDestroy {
  private modalContainer: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Перемещаем модальное окно в контейнер на уровне .layout
    this.moveModalToContainer();
  }

  ngOnDestroy(): void {
    // Возвращаем модальное окно обратно при уничтожении
    if (this.modalContainer && this.el.nativeElement.parentNode) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    }
  }

  private moveModalToContainer(): void {
    // Используем setTimeout, чтобы убедиться, что DOM готов
    setTimeout(() => {
      const container = document.getElementById('modal-container') || document.querySelector('.layout') || document.body;
      if (container && this.el.nativeElement) {
        // Проверяем, не перемещено ли уже
        if (this.el.nativeElement.parentNode !== container) {
          container.appendChild(this.el.nativeElement);
          this.modalContainer = container as HTMLElement;
        }
      }
    }, 0);
  }
}

