import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarAplikasiComponent } from './daftar-aplikasi.component';

describe('DaftarAplikasiComponent', () => {
  let component: DaftarAplikasiComponent;
  let fixture: ComponentFixture<DaftarAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
