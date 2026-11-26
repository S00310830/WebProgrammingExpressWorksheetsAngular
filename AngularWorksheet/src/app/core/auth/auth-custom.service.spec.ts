import { TestBed } from '@angular/core/testing';
import { AuthCustomService } from './auth-custom.service';
import { describe, it, expect, beforeEach } from 'vitest';


describe('AuthCustomService', () => {
  let service: AuthCustomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthCustomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
