import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Warehouse } from './warehouse';
import { WarehouseCategories } from './categories/warehouse-categories';
import { WarehouseProducts } from './products/warehouse-products';
import { WarehouseStock } from './stock/warehouse-stock';
import { WarehouseWriteOffs } from './write-offs/warehouse-write-offs';
import { WarehouseForecast } from './forecast/warehouse-forecast';

const routes: Routes = [
  {
    path: '',
    component: Warehouse,
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { path: 'categories', component: WarehouseCategories },
      { path: 'products', component: WarehouseProducts },
      { path: 'stock', component: WarehouseStock },
      { path: 'write-offs', component: WarehouseWriteOffs },
      { path: 'forecast', component: WarehouseForecast },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule {}

