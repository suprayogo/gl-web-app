import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanJurnalRevComponent } from './laporan-jurnal-rev.component';

describe('LaporanJurnalRevComponent', () => {
  let component: LaporanJurnalRevComponent;
  let fixture: ComponentFixture<LaporanJurnalRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanJurnalRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanJurnalRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
