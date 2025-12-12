import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptLine } from './receipt-line';

describe('ReceiptLine', () => {
  let component: ReceiptLine;
  let fixture: ComponentFixture<ReceiptLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiptLine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptLine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
