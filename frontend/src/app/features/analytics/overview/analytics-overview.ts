import { Component, computed } from '@angular/core';
import { Analytics } from '../../../core/analytics';

@Component({
  selector: 'app-analytics-overview',
  standalone: false,
  templateUrl: './analytics-overview.html',
  styleUrl: './analytics-overview.scss',
})
export class AnalyticsOverview {
  protected readonly points = computed(() => this.analytics.getOverview()());

  constructor(private readonly analytics: Analytics) {}
}

