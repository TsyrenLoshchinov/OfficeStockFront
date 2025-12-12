import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Receipts } from './receipts';
import { AddReceipt } from './add-receipt/add-receipt';
import { LastReceiptLine } from './last-receipt-line/last-receipt-line';

const routes: Routes = [
  {
    path: '',
    component: Receipts,
    children: [
      { path: '', redirectTo: 'add', pathMatch: 'full' },
      { path: 'add', component: AddReceipt },
      { path: 'last-line', component: LastReceiptLine }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptsRoutingModule { }
