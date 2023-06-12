import { TestBed } from '@angular/core/testing';

import { WalletLibService } from './wallet-lib.service';

describe('WalletLibService', () => {
  let service: WalletLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
