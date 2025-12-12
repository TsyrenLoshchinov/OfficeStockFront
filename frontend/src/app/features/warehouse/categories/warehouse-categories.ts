import { Component, computed } from '@angular/core';
import { Warehouse } from '../../../core/warehouse';

@Component({
  selector: 'app-warehouse-categories',
  standalone: false,
  templateUrl: './warehouse-categories.html',
  styleUrl: './warehouse-categories.scss',
})
export class WarehouseCategories {
  protected readonly categories = computed(() => this.warehouse.getCategories()());

  constructor(private readonly warehouse: Warehouse) {}
}

