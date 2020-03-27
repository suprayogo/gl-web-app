import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtomatisJurnalComponent } from './otomatis-jurnal.component';

describe('OtomatisJurnalComponent', () => {
  let component: OtomatisJurnalComponent;
  let fixture: ComponentFixture<OtomatisJurnalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtomatisJurnalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtomatisJurnalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
