import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionImpactComponent } from './direction-impact.component';

describe('DirectionImpactComponent', () => {
  let component: DirectionImpactComponent;
  let fixture: ComponentFixture<DirectionImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectionImpactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
