import { Component, computed } from '@angular/core';
import { Recognition } from '../../../core/recognition';

@Component({
  selector: 'app-recognition-errors',
  standalone: false,
  templateUrl: './recognition-errors.html',
  styleUrl: './recognition-errors.scss',
})
export class RecognitionErrors {
  protected readonly errors = computed(() => this.recognition.getErrors()());

  constructor(private readonly recognition: Recognition) {}
}

