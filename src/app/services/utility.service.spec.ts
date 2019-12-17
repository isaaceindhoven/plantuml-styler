import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));

  it('should be created', () => {
    const service: UtilityService = TestBed.get(UtilityService);
    expect(service).toBeTruthy();
  });
});
