import { Component, computed } from '@angular/core';
import { Warehouse } from '../../../core/warehouse';

@Component({
  selector: 'app-warehouse-products',
  standalone: false,
  templateUrl: './warehouse-products.html',
  styleUrl: './warehouse-products.scss',
})
export class WarehouseProducts {
  protected readonly products = computed(() => this.warehouse.getProducts()());
  protected readonly categories = computed(() => this.warehouse.getCategories()());

  constructor(private readonly warehouse: Warehouse) {}

  protected categoryName(id: string) {
    return this.categories().find((c) => c.id === id)?.name || '—';
  }
}

