import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerusahaanComponent } from './perusahaan.component';

describe('PerusahaanComponent', () => {
  let component: PerusahaanComponent;
  let fixture: ComponentFixture<PerusahaanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerusahaanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerusahaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
