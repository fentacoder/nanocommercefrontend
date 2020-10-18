import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificActivityComponent } from './specific-activity.component';

describe('SpecificActivityComponent', () => {
  let component: SpecificActivityComponent;
  let fixture: ComponentFixture<SpecificActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
