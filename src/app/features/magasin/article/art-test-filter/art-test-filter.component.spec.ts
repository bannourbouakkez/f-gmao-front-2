import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtTestFilterComponent } from './art-test-filter.component';

describe('ArtTestFilterComponent', () => {
  let component: ArtTestFilterComponent;
  let fixture: ComponentFixture<ArtTestFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtTestFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtTestFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
