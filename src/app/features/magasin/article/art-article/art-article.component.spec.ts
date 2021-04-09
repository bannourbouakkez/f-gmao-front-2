import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtArticleComponent } from './art-article.component';

describe('ArtArticleComponent', () => {
  let component: ArtArticleComponent;
  let fixture: ComponentFixture<ArtArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
