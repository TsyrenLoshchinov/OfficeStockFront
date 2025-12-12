import { Injectable, signal } from '@angular/core';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  preview?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly uploadedFiles = signal<UploadedFile[]>([]);

  uploadFile(file: File): Promise<UploadedFile> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const uploaded: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          preview: reader.result as string,
        };
        this.uploadedFiles.update((files) => [uploaded, ...files]);
        setTimeout(() => resolve(uploaded), 1000);
      };
      reader.readAsDataURL(file);
    });
  }

  getUploadedFiles() {
    return this.uploadedFiles.asReadonly();
  }

  getLastUploaded(count: number = 4) {
    return signal(this.uploadedFiles().slice(0, count));
  }
}

