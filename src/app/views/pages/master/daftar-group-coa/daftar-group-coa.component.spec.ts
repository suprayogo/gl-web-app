import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarGroupCoaComponent } from './daftar-group-coa.component';

describe('DaftarGroupCoaComponent', () => {
  let component: DaftarGroupCoaComponent;
  let fixture: ComponentFixture<DaftarGroupCoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarGroupCoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarGroupCoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
