import { TestBed } from '@angular/core/testing';

import { CompanyinfoService } from './companyinfo.service';

describe('CompanyinfoService', () => {
  let service: CompanyinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
