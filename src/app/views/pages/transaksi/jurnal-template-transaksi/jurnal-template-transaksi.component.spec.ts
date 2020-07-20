import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurnalTemplateTransaksiComponent } from './jurnal-template-transaksi.component';

describe('JurnalTemplateTransaksiComponent', () => {
  let component: JurnalTemplateTransaksiComponent;
  let fixture: ComponentFixture<JurnalTemplateTransaksiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JurnalTemplateTransaksiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JurnalTemplateTransaksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
