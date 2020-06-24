import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajuanBukaPeriodeKasirComponent } from './pengajuan-buka-periode-kasir.component';

describe('PengajuanBukaPeriodeKasirComponent', () => {
  let component: PengajuanBukaPeriodeKasirComponent;
  let fixture: ComponentFixture<PengajuanBukaPeriodeKasirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengajuanBukaPeriodeKasirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengajuanBukaPeriodeKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
