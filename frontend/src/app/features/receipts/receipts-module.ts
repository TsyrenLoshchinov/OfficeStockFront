import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptsRoutingModule } from './receipts-routing-module';
import { Receipts } from './receipts';
import { AddReceipt } from './add-receipt/add-receipt';
import { LastReceiptLine } from './last-receipt-line/last-receipt-line';
import { ReceiptLine } from '../../shared/receipt-line/receipt-line';


@NgModule({
  declarations: [
    Receipts,
    AddReceipt,
    LastReceiptLine,
    ReceiptLine
  ],
  imports: [
    CommonModule,
    ReceiptsRoutingModule
  ]
})
export class ReceiptsModule { }
