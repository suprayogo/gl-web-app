import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanNeracaRevComponent } from './laporan-neraca-rev.component';

describe('LaporanNeracaRevComponent', () => {
  let component: LaporanNeracaRevComponent;
  let fixture: ComponentFixture<LaporanNeracaRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanNeracaRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanNeracaRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
