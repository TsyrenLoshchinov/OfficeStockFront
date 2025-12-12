import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceipt } from './add-receipt';

describe('AddReceipt', () => {
  let component: AddReceipt;
  let fixture: ComponentFixture<AddReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReceipt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
