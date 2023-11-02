import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSidebarComponent } from './timeline-sidebar.component';

describe('TimelineSidebarComponent', () => {
  let component: TimelineSidebarComponent;
  let fixture: ComponentFixture<TimelineSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
