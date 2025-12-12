import { Component, computed } from '@angular/core';
import { Warehouse } from '../../../core/warehouse';

@Component({
  selector: 'app-warehouse-stock',
  standalone: false,
  templateUrl: './warehouse-stock.html',
  styleUrl: './warehouse-stock.scss',
})
export class WarehouseStock {
  protected readonly stock = computed(() => this.warehouse.getStock()());
  protected readonly products = computed(() => this.warehouse.getProducts()());

  constructor(private readonly warehouse: Warehouse) {}

  protected productName(id: string) {
    return this.products().find((p) => p.id === id)?.name || '—';
  }
}

