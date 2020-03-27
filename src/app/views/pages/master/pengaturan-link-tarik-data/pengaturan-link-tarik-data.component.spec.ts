import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengaturanLinkTarikDataComponent } from './pengaturan-link-tarik-data.component';

describe('PengaturanLinkTarikDataComponent', () => {
  let component: PengaturanLinkTarikDataComponent;
  let fixture: ComponentFixture<PengaturanLinkTarikDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengaturanLinkTarikDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengaturanLinkTarikDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
