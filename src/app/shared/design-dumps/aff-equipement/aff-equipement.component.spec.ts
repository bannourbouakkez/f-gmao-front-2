import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffEquipementComponent } from './aff-equipement.component';

describe('AffEquipementComponent', () => {
  let component: AffEquipementComponent;
  let fixture: ComponentFixture<AffEquipementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffEquipementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
