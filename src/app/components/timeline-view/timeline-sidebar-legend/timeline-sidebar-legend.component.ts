import { Component, Input, OnInit } from '@angular/core';
import { EventType } from 'src/app/models/EventType';

@Component({
  selector: 'app-timeline-sidebar-legend',
  templateUrl: './timeline-sidebar-legend.component.html',
  styleUrls: ['./timeline-sidebar-legend.component.scss']
})
export class TimelineSidebarLegendComponent implements OnInit {

  @Input() eventType: EventType | null = null;
  
  constructor() { }

  ngOnInit(): void {
  }

}
