import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengaturanLaporanComponent } from './pengaturan-laporan.component';

describe('PengaturanLaporanComponent', () => {
  let component: PengaturanLaporanComponent;
  let fixture: ComponentFixture<PengaturanLaporanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengaturanLaporanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengaturanLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
