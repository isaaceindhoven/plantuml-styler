import { TestBed } from '@angular/core/testing';

import { GenerateService } from './generate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GenerateService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));

  it('should be created', () => {
    const service: GenerateService = TestBed.get(GenerateService);
    expect(service).toBeTruthy();
  });
});
