import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidRequestSentComponent } from './bid-request-sent.component';

describe('BidRequestSentComponent', () => {
  let component: BidRequestSentComponent;
  let fixture: ComponentFixture<BidRequestSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidRequestSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidRequestSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
