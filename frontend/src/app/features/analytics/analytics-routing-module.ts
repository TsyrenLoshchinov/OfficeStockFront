import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Analytics } from './analytics';
import { AnalyticsOverview } from './overview/analytics-overview';
import { AnalyticsDynamics } from './dynamics/analytics-dynamics';
import { AnalyticsCosts } from './costs/analytics-costs';

const routes: Routes = [
  {
    path: '',
    component: Analytics,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AnalyticsOverview },
      { path: 'dynamics', component: AnalyticsDynamics },
      { path: 'costs', component: AnalyticsCosts },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsRoutingModule {}

