import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Recognition } from './recognition';
import { RecognitionStatus } from './status/recognition-status';
import { RecognitionResult } from './result/recognition-result';
import { RecognitionErrors } from './errors/recognition-errors';

const routes: Routes = [
  {
    path: '',
    component: Recognition,
    children: [
      { path: '', redirectTo: 'status', pathMatch: 'full' },
      { path: 'status', component: RecognitionStatus },
      { path: 'result', component: RecognitionResult },
      { path: 'errors', component: RecognitionErrors },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecognitionRoutingModule {}

