import { Component, computed } from '@angular/core';
import { Recognition } from '../../../core/recognition';

@Component({
  selector: 'app-recognition-result',
  standalone: false,
  templateUrl: './recognition-result.html',
  styleUrl: './recognition-result.scss',
})
export class RecognitionResult {
  protected readonly results = computed(() => this.recognition.getResults()());

  constructor(private readonly recognition: Recognition) {}
}

