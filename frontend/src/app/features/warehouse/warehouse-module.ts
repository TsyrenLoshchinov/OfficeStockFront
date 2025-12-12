import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WarehouseRoutingModule } from './warehouse-routing-module';
import { Warehouse } from './warehouse';
import { WarehouseCategories } from './categories/warehouse-categories';
import { WarehouseProducts } from './products/warehouse-products';
import { WarehouseStock } from './stock/warehouse-stock';
import { WarehouseWriteOffs } from './write-offs/warehouse-write-offs';
import { WarehouseForecast } from './forecast/warehouse-forecast';

@NgModule({
  declarations: [
    Warehouse,
    WarehouseCategories,
    WarehouseProducts,
    WarehouseStock,
    WarehouseWriteOffs,
    WarehouseForecast,
  ],
  imports: [CommonModule, RouterModule, WarehouseRoutingModule],
})
export class WarehouseModule {}

