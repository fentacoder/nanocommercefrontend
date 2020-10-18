import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSellingComponent } from './user-selling.component';

describe('UserSellingComponent', () => {
  let component: UserSellingComponent;
  let fixture: ComponentFixture<UserSellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSellingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
