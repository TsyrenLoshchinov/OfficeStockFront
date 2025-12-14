import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptsService } from '../services/receipts.service';
import { ReceiptUploadResponse } from '../../../core/models/receipt.model';

@Component({
  selector: 'app-upload-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-receipt.component.html',
  styleUrls: ['./upload-receipt.component.css']
})
export class UploadReceiptComponent {
  @Output() receiptUploaded = new EventEmitter<ReceiptUploadResponse>();
  
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  errorMessage = '';
  fileInfo: { name: string; size: string; type: string } | null = null;

  constructor(private receiptsService: ReceiptsService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.validateAndSelectFile(file);
    }
  }

  onButtonClick(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  }

  private validateAndSelectFile(file: File): void {
    // Проверка формата файла
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      this.errorMessage = 'Недопустимый формат файла. Разрешены только: JPG, JPEG, PNG, PDF';
      return;
    }

    // Проверка размера файла (10 МБ)
    const maxSize = 10 * 1024 * 1024; // 10 МБ в байтах
    if (file.size > maxSize) {
      this.errorMessage = 'Размер файла превышает 10 МБ. Пожалуйста, выберите файл меньшего размера.';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';
    this.fileInfo = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' МБ',
      type: file.type || fileExtension.toUpperCase()
    };

    // Автоматическая загрузка после выбора файла
    this.uploadFile();
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';

    // Симуляция прогресса загрузки
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 200);

    this.receiptsService.uploadReceipt(this.selectedFile).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.isUploading = false;
          // После успешной загрузки отправляем событие, модалка откроется поверх компонента
          // Сбрасываем состояние компонента, чтобы модалка могла открыться
          const file = this.selectedFile;
          this.selectedFile = null;
          this.fileInfo = null;
          this.receiptUploaded.emit(response);
        }, 500);
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isUploading = false;
        this.uploadProgress = 0;
        // Очищаем выбранный файл при ошибке, чтобы пользователь мог выбрать другой
        const errorMsg = error.error?.message || error.error?.detail || error.message || 'Ошибка при загрузке файла. Попробуйте еще раз.';
        this.errorMessage = errorMsg;
        // Не очищаем selectedFile сразу, чтобы пользователь мог увидеть ошибку и попробовать снова
      }
    });
  }

  cancelUpload(): void {
    this.selectedFile = null;
    this.isUploading = false;
    this.uploadProgress = 0;
    this.fileInfo = null;
    this.errorMessage = '';
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  retryUpload(): void {
    if (this.selectedFile && !this.isUploading) {
      this.errorMessage = '';
      this.uploadFile();
    }
  }
}

