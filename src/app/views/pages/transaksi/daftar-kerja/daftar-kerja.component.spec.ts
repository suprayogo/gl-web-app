import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarKerjaComponent } from './daftar-kerja.component';

describe('DaftarKerjaComponent', () => {
  let component: DaftarKerjaComponent;
  let fixture: ComponentFixture<DaftarKerjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarKerjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarKerjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
