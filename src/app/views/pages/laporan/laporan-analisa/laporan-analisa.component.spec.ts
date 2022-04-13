import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanAnalisaComponent } from './laporan-analisa.component';

describe('LaporanAnalisaComponent', () => {
  let component: LaporanAnalisaComponent;
  let fixture: ComponentFixture<LaporanAnalisaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanAnalisaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanAnalisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
