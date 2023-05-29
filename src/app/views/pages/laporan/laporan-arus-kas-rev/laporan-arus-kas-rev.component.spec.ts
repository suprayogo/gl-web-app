import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanArusKasRevComponent } from './laporan-arus-kas-rev.component';

describe('LaporanArusKasRevComponent', () => {
  let component: LaporanArusKasRevComponent;
  let fixture: ComponentFixture<LaporanArusKasRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanArusKasRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanArusKasRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
