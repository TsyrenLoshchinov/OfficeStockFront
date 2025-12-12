import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastReceiptLine } from './last-receipt-line';

describe('LastReceiptLine', () => {
  let component: LastReceiptLine;
  let fixture: ComponentFixture<LastReceiptLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastReceiptLine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastReceiptLine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
