import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecksRoutingModule } from './checks-routing-module';
import { ChecksPage } from './checks';

@NgModule({
  declarations: [ChecksPage],
  imports: [CommonModule, ChecksRoutingModule],
})
export class ChecksModule {}

