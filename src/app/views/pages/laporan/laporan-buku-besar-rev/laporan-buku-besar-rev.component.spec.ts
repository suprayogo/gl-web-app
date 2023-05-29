import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanBukuBesarRevComponent } from './laporan-buku-besar-rev.component';

describe('LaporanBukuBesarRevComponent', () => {
  let component: LaporanBukuBesarRevComponent;
  let fixture: ComponentFixture<LaporanBukuBesarRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanBukuBesarRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanBukuBesarRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
