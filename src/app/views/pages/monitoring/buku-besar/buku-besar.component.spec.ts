import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BukuBesarComponent } from './buku-besar.component';

describe('BukuBesarComponent', () => {
  let component: BukuBesarComponent;
  let fixture: ComponentFixture<BukuBesarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BukuBesarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BukuBesarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
