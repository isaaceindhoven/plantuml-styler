import { TestBed } from '@angular/core/testing';

import { ImportExportService } from './importexport.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ImportExportService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));

  it('should be created', () => {
    const service: ImportExportService = TestBed.get(ImportExportService);
    expect(service).toBeTruthy();
  });
});
