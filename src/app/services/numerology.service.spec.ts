import { TestBed } from '@angular/core/testing';

import { NumerologyService } from './numerology.service';

describe('NumerologyService', () => {
  let service: NumerologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumerologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
