import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HorizontalScrollDirective } from './directives/horizontal-scroll.directive';
import { TimelineSidebarLegendComponent } from './timeline-sidebar-legend/timeline-sidebar-legend.component';
import { TimelineSidebarComponent } from './timeline-sidebar/timeline-sidebar.component';
import { TimelineViewComponent } from './timeline-view.component';



@NgModule({
  declarations: [
    TimelineViewComponent,
    TimelineSidebarComponent,
    TimelineSidebarLegendComponent,
    HorizontalScrollDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [TimelineViewComponent]
})
export class TimelineViewModule { }
