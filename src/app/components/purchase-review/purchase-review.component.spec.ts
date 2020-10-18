import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReviewComponent } from './purchase-review.component';

describe('PurchaseReviewComponent', () => {
  let component: PurchaseReviewComponent;
  let fixture: ComponentFixture<PurchaseReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
