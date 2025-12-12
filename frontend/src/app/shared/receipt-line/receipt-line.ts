import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-receipt-line',
  standalone: false,
  templateUrl: './receipt-line.html',
  styleUrl: './receipt-line.scss',
})
export class ReceiptLine {
  @Input() content = 'Контент строки чека';
}
