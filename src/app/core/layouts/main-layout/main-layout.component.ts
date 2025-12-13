import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;
  isSidebarOpen = signal<boolean>(false);
  private intervalId?: number;

  ngOnInit(): void {
    this.checkSidebarState();
    this.intervalId = window.setInterval(() => this.checkSidebarState(), 100);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private checkSidebarState(): void {
    const sidebar = document.querySelector('.sidebar[data-open="true"]');
    this.isSidebarOpen.set(!!sidebar);
  }
}

