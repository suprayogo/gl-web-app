import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurnalUmumTutupSementaraComponent } from './jurnal-umum-tutup-sementara.component';

describe('JurnalUmumTutupSementaraComponent', () => {
  let component: JurnalUmumTutupSementaraComponent;
  let fixture: ComponentFixture<JurnalUmumTutupSementaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JurnalUmumTutupSementaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JurnalUmumTutupSementaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
