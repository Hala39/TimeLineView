import { Component, OnInit } from '@angular/core';
import { EventType } from './components/timeline-view/models/EventType';
import { TimeLineViewEvent } from './components/timeline-view/models/TimeLineViewEvent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'timeline';

  eventTypes: EventType[] = [ 
  {
    id: 1,
    name: "Meetings and Discussions",
    color: "red",
    bgColor: "pink",
  },
  {
    id: 2,
    name: "Project Management",
    color: "blue",
    bgColor: "lightblue",
  },
  {
    id: 3,
    name: "Coding",
    color: "green",
    bgColor: "lightgreen",
  },
  {
    id: 4,
    name: "Testing",
    color: "brown",
    bgColor: "orange",
  },
  {
    id: 5,
    name: "Administartion",
    color: "purple",
    bgColor: "violet",
  },
];

  events: TimeLineViewEvent[] = [];

  ngOnInit() {
    const startDate = new Date(2022, 0, 1);
    const endDate = new Date(2023, 11, 30);
    const numberOfEvents = 300;
    this.events = this.generateFakeEvents(startDate, endDate, numberOfEvents);
  }

  generateFakeEvents(startDate: Date, endDate: Date, numberOfEvents: number) {
    const events = [];
    const eventTypesCount = this.eventTypes.length;
    const timeRange = endDate.getTime() - startDate.getTime();
  
    for (let i = 1; i <= numberOfEvents; i++) {
      const randomEventType = this.eventTypes[Math.floor(Math.random() * eventTypesCount)];
      const randomStartTime = new Date(startDate.getTime() + Math.random() * timeRange);
      const randomEndTime = new Date(randomStartTime.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000);
  
      const fakeEvent = {
        id: i,
        name: `${i} ${randomEventType.name}`,
        startDate: randomStartTime,
        endDate: randomEndTime,
        typeId: randomEventType.id,
      };
  
      events.push(fakeEvent);
    }
    
    return events;
  }
}
