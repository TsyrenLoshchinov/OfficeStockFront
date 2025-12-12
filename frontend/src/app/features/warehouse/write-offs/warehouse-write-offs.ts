import { Component, computed } from '@angular/core';
import { Warehouse } from '../../../core/warehouse';

@Component({
  selector: 'app-warehouse-write-offs',
  standalone: false,
  templateUrl: './warehouse-write-offs.html',
  styleUrl: './warehouse-write-offs.scss',
})
export class WarehouseWriteOffs {
  protected readonly writeOffs = computed(() => this.warehouse.getWriteOffs()());
  protected readonly products = computed(() => this.warehouse.getProducts()());

  constructor(private readonly warehouse: Warehouse) {}

  protected productName(id: string) {
    return this.products().find((p) => p.id === id)?.name || '—';
  }
}

