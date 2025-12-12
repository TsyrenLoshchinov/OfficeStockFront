import { Component, computed, signal, ViewChild, ElementRef } from '@angular/core';
import { UploadService } from '../../core/upload.service';

@Component({
  selector: 'app-main-page',
  standalone: false,
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class MainPage {
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;

  protected readonly uploads = computed(() => this.uploadService.getUploadedFiles()());
  protected readonly selectedFileName = signal<string | null>(null);

  constructor(private readonly uploadService: UploadService) {}

  protected triggerUpload(): void {
    this.fileInput?.nativeElement.click();
  }

  protected async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.selectedFileName.set(file.name);
    await this.uploadService.uploadFile(file);
  }
}

