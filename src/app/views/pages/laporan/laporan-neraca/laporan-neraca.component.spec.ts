import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanNeracaComponent } from './laporan-neraca.component';

describe('LaporanNeracaComponent', () => {
  let component: LaporanNeracaComponent;
  let fixture: ComponentFixture<LaporanNeracaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanNeracaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanNeracaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
