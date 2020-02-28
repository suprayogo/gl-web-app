import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailJurnalComponent } from './detail-jurnal.component';

describe('DetailJurnalComponent', () => {
  let component: DetailJurnalComponent;
  let fixture: ComponentFixture<DetailJurnalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailJurnalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailJurnalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
