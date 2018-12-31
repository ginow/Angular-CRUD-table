import { TestBed } from '@angular/core/testing';

import { CrmWebapiServiceService } from './crm-webapi-service.service';

describe('CrmWebapiServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrmWebapiServiceService = TestBed.get(CrmWebapiServiceService);
    expect(service).toBeTruthy();
  });
});
