import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineViewComponent } from './timeline-view.component';
import { TimelineSidebarComponent } from './timeline-sidebar/timeline-sidebar.component';
import { TimelineSidebarLegendComponent } from './timeline-sidebar-legend/timeline-sidebar-legend.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TimelineViewComponent,
    TimelineSidebarComponent,
    TimelineSidebarLegendComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [TimelineViewComponent]
})
export class TimelineViewModule { }
