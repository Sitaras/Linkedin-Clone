import { TestBed } from '@angular/core/testing';

import { JobPostService } from './jobpost.service';

describe('JobpostService', () => {
  let service: JobPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
