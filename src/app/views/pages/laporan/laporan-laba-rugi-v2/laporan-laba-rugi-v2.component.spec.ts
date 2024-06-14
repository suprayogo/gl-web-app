import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanLabaRugiV2Component } from './laporan-laba-rugi-v2.component';

describe('LaporanLabaRugiV2Component', () => {
  let component: LaporanLabaRugiV2Component;
  let fixture: ComponentFixture<LaporanLabaRugiV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanLabaRugiV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanLabaRugiV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
