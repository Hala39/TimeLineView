import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineViewComponent } from './timeline-view.component';



@NgModule({
  declarations: [
    TimelineViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [TimelineViewComponent]
})
export class TimelineViewModule { }
