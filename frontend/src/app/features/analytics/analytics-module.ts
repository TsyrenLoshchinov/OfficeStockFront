import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsRoutingModule } from './analytics-routing-module';
import { Analytics } from './analytics';
import { AnalyticsOverview } from './overview/analytics-overview';
import { AnalyticsDynamics } from './dynamics/analytics-dynamics';
import { AnalyticsCosts } from './costs/analytics-costs';

@NgModule({
  declarations: [
    Analytics,
    AnalyticsOverview,
    AnalyticsDynamics,
    AnalyticsCosts,
  ],
  imports: [CommonModule, RouterModule, AnalyticsRoutingModule],
})
export class AnalyticsModule {}

