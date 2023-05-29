import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurnalBatchRevComponent } from './jurnal-batch-rev.component';

describe('JurnalBatchRevComponent', () => {
  let component: JurnalBatchRevComponent;
  let fixture: ComponentFixture<JurnalBatchRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JurnalBatchRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JurnalBatchRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
