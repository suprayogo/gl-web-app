import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengaturanLaporanV3Component } from './pengaturan-laporan-v3.component';

describe('PengaturanLaporanV3Component', () => {
  let component: PengaturanLaporanV3Component;
  let fixture: ComponentFixture<PengaturanLaporanV3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengaturanLaporanV3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengaturanLaporanV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
