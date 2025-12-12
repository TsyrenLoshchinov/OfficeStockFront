import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from './notifications-routing-module';
import { NotificationsPage } from './notifications';

@NgModule({
  declarations: [NotificationsPage],
  imports: [CommonModule, NotificationsRoutingModule],
})
export class NotificationsModule {}

