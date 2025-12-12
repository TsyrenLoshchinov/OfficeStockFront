import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing-module';
import { MainPage } from './main';

@NgModule({
  declarations: [MainPage],
  imports: [CommonModule, MainRoutingModule],
})
export class MainModule {}

