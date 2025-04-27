import { TestBed } from '@angular/core/testing';

import { PasswordRequirementsService } from './password-requirements.service';

describe('PasswordRequirementsService', () => {
  let service: PasswordRequirementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordRequirementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
