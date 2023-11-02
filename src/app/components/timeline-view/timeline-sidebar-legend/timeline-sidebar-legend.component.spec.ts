import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSidebarLegendComponent } from './timeline-sidebar-legend.component';

describe('TimelineSidebarLegendComponent', () => {
  let component: TimelineSidebarLegendComponent;
  let fixture: ComponentFixture<TimelineSidebarLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineSidebarLegendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineSidebarLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
