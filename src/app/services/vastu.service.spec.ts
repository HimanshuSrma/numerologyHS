import { TestBed } from '@angular/core/testing';

import { VastuService } from './vastu.service';

describe('VastuService', () => {
  let service: VastuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VastuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
