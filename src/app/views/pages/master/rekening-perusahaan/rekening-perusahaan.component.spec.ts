import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekeningPerusahaanComponent } from './rekening-perusahaan.component';

describe('RekeningPerusahaanComponent', () => {
  let component: RekeningPerusahaanComponent;
  let fixture: ComponentFixture<RekeningPerusahaanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekeningPerusahaanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekeningPerusahaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
