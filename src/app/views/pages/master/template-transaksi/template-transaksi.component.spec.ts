import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTransaksiComponent } from './template-transaksi.component';

describe('TemplateTransaksiComponent', () => {
  let component: TemplateTransaksiComponent;
  let fixture: ComponentFixture<TemplateTransaksiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateTransaksiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateTransaksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
