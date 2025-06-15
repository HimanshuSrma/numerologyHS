import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediesPanelComponent } from './remedies-panel.component';

describe('RemediesPanelComponent', () => {
  let component: RemediesPanelComponent;
  let fixture: ComponentFixture<RemediesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemediesPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemediesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
