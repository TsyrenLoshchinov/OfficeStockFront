import { Component, computed } from '@angular/core';
import { Warehouse } from '../../../core/warehouse';

@Component({
  selector: 'app-warehouse-forecast',
  standalone: false,
  templateUrl: './warehouse-forecast.html',
  styleUrl: './warehouse-forecast.scss',
})
export class WarehouseForecast {
  protected readonly forecast = computed(() => this.warehouse.getForecast()());
  protected readonly products = computed(() => this.warehouse.getProducts()());

  constructor(private readonly warehouse: Warehouse) {}

  protected productName(id: string) {
    return this.products().find((p) => p.id === id)?.name || '—';
  }
}

