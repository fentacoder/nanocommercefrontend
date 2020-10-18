import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutErrorComponent } from './payout-error.component';

describe('PayoutErrorComponent', () => {
  let component: PayoutErrorComponent;
  let fixture: ComponentFixture<PayoutErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
