import { TestBed, inject } from '@angular/core/testing';

import { WebRequestService } from './web-request.service';

describe('WebRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebRequestService]
    });
  });

  it('should be created', inject([WebRequestService], (service: WebRequestService) => {
    expect(service).toBeTruthy();
  }));
});
