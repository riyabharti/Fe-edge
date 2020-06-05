import { TestBed } from '@angular/core/testing';

import { TokenizeService } from './tokenize.service';

describe('TokenizeService', () => {
  let service: TokenizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
