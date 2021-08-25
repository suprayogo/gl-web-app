import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataJurnalBatchComponent } from './data-jurnal-batch.component';

describe('DataJurnalBatchComponent', () => {
  let component: DataJurnalBatchComponent;
  let fixture: ComponentFixture<DataJurnalBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataJurnalBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataJurnalBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
