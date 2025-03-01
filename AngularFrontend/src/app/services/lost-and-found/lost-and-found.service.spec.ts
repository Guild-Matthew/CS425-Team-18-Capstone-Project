import { TestBed } from '@angular/core/testing';

import { LostAndFoundService } from './lost-and-found.service';

describe('LostAndFoundService', () => {
  let service: LostAndFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LostAndFoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
