import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing-module';
import { ProfilePage } from './profile';

@NgModule({
  declarations: [ProfilePage],
  imports: [CommonModule, ProfileRoutingModule],
})
export class ProfileModule {}

