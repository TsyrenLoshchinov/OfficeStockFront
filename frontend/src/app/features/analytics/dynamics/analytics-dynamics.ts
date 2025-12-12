import { Component, computed } from '@angular/core';
import { Analytics } from '../../../core/analytics';

@Component({
  selector: 'app-analytics-dynamics',
  standalone: false,
  templateUrl: './analytics-dynamics.html',
  styleUrl: './analytics-dynamics.scss',
})
export class AnalyticsDynamics {
  protected readonly dynamics = computed(() => this.analytics.getDynamics()());

  constructor(private readonly analytics: Analytics) {}
}

