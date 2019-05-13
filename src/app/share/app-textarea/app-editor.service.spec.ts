import { TestBed } from '@angular/core/testing';

import { AppEditorService } from './app-editor.service';

describe('AppEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppEditorService = TestBed.get(AppEditorService);
    expect(service).toBeTruthy();
  });
});
