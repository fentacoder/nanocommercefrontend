import { TestBed } from '@angular/core/testing';

import { ListAllService } from './list-all.service';

describe('ListAllService', () => {
  let service: ListAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
