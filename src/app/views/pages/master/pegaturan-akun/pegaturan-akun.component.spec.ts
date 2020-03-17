import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegaturanAkunComponent } from './pegaturan-akun.component';

describe('PegaturanAkunComponent', () => {
  let component: PegaturanAkunComponent;
  let fixture: ComponentFixture<PegaturanAkunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaturanAkunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaturanAkunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
