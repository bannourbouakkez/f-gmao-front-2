import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FounisseurSecteurComponent } from './founisseur-secteur.component';

describe('FounisseurSecteurComponent', () => {
  let component: FounisseurSecteurComponent;
  let fixture: ComponentFixture<FounisseurSecteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FounisseurSecteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FounisseurSecteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
