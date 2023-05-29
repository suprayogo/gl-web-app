import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanAnalisaRevComponent } from './laporan-analisa-rev.component';

describe('LaporanAnalisaRevComponent', () => {
  let component: LaporanAnalisaRevComponent;
  let fixture: ComponentFixture<LaporanAnalisaRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanAnalisaRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanAnalisaRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
