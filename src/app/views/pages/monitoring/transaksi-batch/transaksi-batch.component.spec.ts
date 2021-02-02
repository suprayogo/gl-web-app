import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksiBatchComponent } from './transaksi-batch.component';

describe('TransaksiBatchComponent', () => {
  let component: TransaksiBatchComponent;
  let fixture: ComponentFixture<TransaksiBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransaksiBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaksiBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
