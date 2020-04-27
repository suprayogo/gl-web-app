import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanArusKasComponent } from './laporan-arus-kas.component';

describe('LaporanArusKasComponent', () => {
  let component: LaporanArusKasComponent;
  let fixture: ComponentFixture<LaporanArusKasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanArusKasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanArusKasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
