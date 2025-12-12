import { Component, computed } from '@angular/core';
import { Analytics } from '../../../core/analytics';

@Component({
  selector: 'app-analytics-costs',
  standalone: false,
  templateUrl: './analytics-costs.html',
  styleUrl: './analytics-costs.scss',
})
export class AnalyticsCosts {
  protected readonly structure = computed(() => this.analytics.getStructure()());

  constructor(private readonly analytics: Analytics) {}
}

