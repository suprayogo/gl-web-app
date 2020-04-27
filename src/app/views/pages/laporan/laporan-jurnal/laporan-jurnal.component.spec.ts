import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanJurnalComponent } from './laporan-jurnal.component';

describe('LaporanJurnalComponent', () => {
  let component: LaporanJurnalComponent;
  let fixture: ComponentFixture<LaporanJurnalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanJurnalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanJurnalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
