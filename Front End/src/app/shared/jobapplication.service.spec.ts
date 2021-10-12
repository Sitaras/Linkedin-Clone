import { TestBed } from '@angular/core/testing';

import { JobapplicationService } from './jobapplication.service';

describe('JobapplicationService', () => {
  let service: JobapplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobapplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
