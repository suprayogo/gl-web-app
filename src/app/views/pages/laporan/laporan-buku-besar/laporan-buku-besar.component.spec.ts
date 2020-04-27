import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanBukuBesarComponent } from './laporan-buku-besar.component';

describe('LaporanBukuBesarComponent', () => {
  let component: LaporanBukuBesarComponent;
  let fixture: ComponentFixture<LaporanBukuBesarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanBukuBesarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanBukuBesarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
