import { Component, computed } from '@angular/core';
import { Recognition } from '../../../core/recognition';

@Component({
  selector: 'app-recognition-status',
  standalone: false,
  templateUrl: './recognition-status.html',
  styleUrl: './recognition-status.scss',
})
export class RecognitionStatus {
  protected readonly statuses = computed(() => this.recognition.getStatuses()());

  constructor(private readonly recognition: Recognition) {}
}

