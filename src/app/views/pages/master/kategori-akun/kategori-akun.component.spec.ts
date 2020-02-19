import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriAkunComponent } from './kategori-akun.component';

describe('KategoriAkunComponent', () => {
  let component: KategoriAkunComponent;
  let fixture: ComponentFixture<KategoriAkunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KategoriAkunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriAkunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
