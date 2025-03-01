import { TestBed } from '@angular/core/testing';

import { AddItemService } from './add-item.service';

describe('AddItemService', () => {
  let service: AddItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
