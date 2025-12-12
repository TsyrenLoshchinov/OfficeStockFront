import { Component } from '@angular/core';

@Component({
  selector: 'app-last-receipt-line',
  standalone: false,
  templateUrl: './last-receipt-line.html',
  styleUrl: './last-receipt-line.scss',
})
export class LastReceiptLine {
  protected readonly content = 'Контент строки чека';
}
