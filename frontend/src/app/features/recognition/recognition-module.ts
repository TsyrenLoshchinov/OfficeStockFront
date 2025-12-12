import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecognitionRoutingModule } from './recognition-routing-module';
import { Recognition } from './recognition';
import { RecognitionStatus } from './status/recognition-status';
import { RecognitionResult } from './result/recognition-result';
import { RecognitionErrors } from './errors/recognition-errors';

@NgModule({
  declarations: [
    Recognition,
    RecognitionStatus,
    RecognitionResult,
    RecognitionErrors,
  ],
  imports: [CommonModule, RouterModule, RecognitionRoutingModule],
})
export class RecognitionModule {}

