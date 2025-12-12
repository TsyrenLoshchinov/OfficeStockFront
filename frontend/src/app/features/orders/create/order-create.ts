import { Component } from '@angular/core';

@Component({
  selector: 'app-order-create',
  standalone: false,
  templateUrl: './order-create.html',
  styleUrl: './order-create.scss',
})
export class OrderCreate {
  protected draft = {
    requester: 'HR',
    comment: '',
    items: [
      { name: 'Бумага A4', qty: 5, price: 500 },
    ],
  };

  protected addItem() {
    this.draft.items.push({ name: 'Новый товар', qty: 1, price: 0 });
  }
}

