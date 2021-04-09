import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NztestComponent } from './nztest.component';

describe('NztestComponent', () => {
  let component: NztestComponent;
  let fixture: ComponentFixture<NztestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NztestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NztestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
