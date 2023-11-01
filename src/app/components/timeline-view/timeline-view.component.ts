import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { hours } from 'src/app/data/hours';
import { months } from 'src/app/data/months';
import { years } from 'src/app/data/years';
import { EventType } from 'src/app/models/EventType';
import { TimelineView } from 'src/app/models/TimelineView';
import { TimeLineViewElement } from 'src/app/models/TimeLineViewElement';
import { TimeLineViewEvent } from 'src/app/models/TimeLineViewEvent';

@Component({
  selector: 'app-timeline-view',
  templateUrl: './timeline-view.component.html',
  styleUrls: ['./timeline-view.component.scss']
})
export class TimelineViewComponent implements AfterViewInit {

  @ViewChild("timeLineRef") timeLineRef!: ElementRef<SVGElement>;

  months = months;
  years = years;
  currentDate: Date = new Date();
  currentMinute: number = this.currentDate.getMinutes();
  currentHour: number = this.currentDate.getHours();
  currentDay: number = this.currentDate.getDate();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  timeLineView: TimelineView = TimelineView.Month;
  selectedYear: number = this.currentDate.getFullYear();
  selectedMonthIndex: number = this.currentDate.getMonth();
  xAxisElements: TimeLineViewElement[] = [];
  width: number = 0;
  height: number = 0;
  leftMargin: number = 0.5;
  rightMargin: number = 0.5;
  topMargin: number = 25;
  xFactor: number = 0;
  yFactor: number = 20;
  millisecondsPerSecond = 1000;
  secondsPerMinute = 60;
  minutesPerHour = 60;
  hoursPerDay = 24;
  daysPerMonth = 30;
  get firstDayOfTheMonth() {return new Date(this.selectedYear, this.selectedMonthIndex, 1)};
  get lastDayOfTheMonth() {return new Date(this.selectedYear, this.selectedMonthIndex + 1, 0)};
  eventTypes: EventType[] = [
    {
      id: 1,
      name: "Meetings and Discussions",
      color: "red",
      bgColor: "pink"
    },
    {
      id: 2,
      name: "Meetings and Discussions",
      color: "blue",
      bgColor: "lightblue"
    },
    {
      id: 3,
      name: "Meetings and Discussions",
      color: "green",
      bgColor: "lightgreen"
    }
  ]

  events: TimeLineViewEvent[] = [
    {
      id: 1,
      name: "1 Meeting with Lulu",
      startDate: new Date(2023, 9, 3, 11, 10, 0),
      endDate: new Date(2023, 9, 5, 12, 0, 0),
      typeId: 1,
    },
    {
      id: 2,
      name: "2 Meeting with Hala",
      startDate: new Date(2023, 9, 6, 12, 0, 0),
      endDate: new Date(2023, 9, 11, 6, 0, 0),
      typeId: 2,
    },
    {
      id: 3,
      name: "3 Meeting with Hala",
      startDate: new Date(2022, 3, 6, 12, 0, 0),
      endDate: new Date(2023, 9, 19, 6, 0, 0),
      typeId: 3,
    },
    {
      id: 4,
      name: "4 Meeting with Hala",
      startDate: new Date(2023, 9, 16, 12, 0, 0),
      endDate: new Date(2023, 10, 22, 6, 0, 0),
      typeId: 1,
    },
    {
      id: 5,
      name: "5 Meeting with Hala",
      startDate: new Date(2023, 10, 6, 3, 0, 0),
      endDate: new Date(2023, 10, 11, 6, 0, 0),
      typeId: 1,
    }
  ];

  includedEvents: TimeLineViewEvent[] = [];

  constructor() { }

  ngAfterViewInit() {
    this.setMeasurements();
  }

  setMeasurements() {
    this.initializeWidth();
    this.initializeXFactor();
    this.initializeXAxisElements();
    this.initializeViewBoxDimensions();
    this.initializeEventsModels();
    this.initializeEventsCoordinates();
  }

  setSelectedYear(event: Event) {
    const year = +(event as any).target.value;
    this.selectedYear = year;
  }

  setSelectedMonth(event: Event) {
    const monthIndex = +(event as any).target.value;
    this.selectedMonthIndex = monthIndex;
    this.setMeasurements();
  }

  private initializeWidth() {
    let width: number = 0;
    switch (this.timeLineView) {
      case TimelineView.Year:
        width = 1000;
        break;
    
      default:
        width = 1800;
        break;
    }
    this.timeLineRef.nativeElement.style.width = `max(100%, ${width}px)`;
  }

  private initializeXFactor() {
    switch (this.timeLineView) {
      case TimelineView.Year:
        this.xFactor = this.getSelectedMonthDaysCount();
        break;
      
      case TimelineView.Month:
        this.xFactor = 24;
        break;

      case TimelineView.Date:
          this.xFactor = 60;
          break;   
    }
  }

  private initializeViewBoxDimensions() {
    this.width = this.xAxisElements.length * this.xFactor; 
    this.height = 700; // for now
  }

  private initializeXAxisElements() {
    let elements: TimeLineViewElement[] = [];
    switch (this.timeLineView) {
      case TimelineView.Year:
        elements = months;
        break;
    
      case TimelineView.Month:
        elements = this.getDaysInMonth();
        break;

      case TimelineView.Date:
        elements = hours;
        break;

      default:
        break;
    }

    this.xAxisElements = elements;
  }

  private initializeEventsModels() {
    this.events.forEach((event: TimeLineViewEvent) => {
      event.type = this.eventTypes.find(e => e.id === event.typeId);
      event.startYear = event.startDate.getFullYear();
      event.startMonth = event.startDate.getMonth();
      event.startDay = event.startDate.getDate();
      event.startHour = event.startDate.getHours();
      event.startMinute = event.startDate.getMinutes();
      event.endYear = event.endDate.getFullYear();
      event.endMonth = event.endDate.getMonth();
      event.endDay = event.endDate.getDate();
      event.endHour = event.endDate.getHours();
      event.endMinute = event.endDate.getMinutes();
    })
  }

  private initializeEventsCoordinates() {
    switch (this.timeLineView) {
      case TimelineView.Year:
        // this.setEventsInMonths();
        break;

      case TimelineView.Month:
        this.setEventsInDays();
        break;
    
      default:
        break;
    }
  }

  // private setEventsInMonths() {
  //   this.events.forEach((event: TimeLineViewEvent, index: number) => {
  //     const startMonth = event.startDate.getMonth();
  //     const startDay = event.startDate.getDate();
  //     const x = (startMonth - 1) * this.xFactor + startDay;
  //     const y = this.topMargin * index + this.topMargin;
  //     const differenceInTime = event.endDate.getTime() - event.startDate.getTime();
  //     const differenceInHours = 
  //       differenceInTime / this.millisecondsPerSecond / this.secondsPerMinute / this.minutesPerHour / this.hoursPerDay / this.daysPerMonth * this.xFactor;
  //     const width = differenceInHours;
  //     const height = 20;
  //     event.x = x;
  //     event.y = y;
  //     event.width = width;
  //     event.height = height;
  //   })
  // }

  private setEventsInDays() {
    this.includedEvents = this.events.filter(e => this.isEventIncludedBetweenDates(e));
    this.includedEvents.forEach((event: TimeLineViewEvent, index: number) => {
      const startDay = event.startDate.getDate();
      const startHour = event.startDate.getHours();
      const isStartDateBeforeTheFirstDay = this.isStartDateBeforeTheFirstDay(event);
      const x = isStartDateBeforeTheFirstDay ? -1 : (startDay - 1) * this.xFactor + startHour;
      const y = this.topMargin * index + this.topMargin;
      const differenceInTime = isStartDateBeforeTheFirstDay ? 
        event.endDate.getTime() - this.firstDayOfTheMonth.getTime() : event.endDate.getTime() - event.startDate.getTime();
      const differenceInHours = 
        differenceInTime / this.millisecondsPerSecond / this.secondsPerMinute / this.minutesPerHour / this.hoursPerDay * this.xFactor;
      const width = differenceInHours;
      const height = 20;
      event.x = x;
      event.y = y;
      event.width = width;
      event.height = height;
      event.showText = differenceInHours > 24;
    })  
  }

  private isStartDateBeforeTheFirstDay(event: TimeLineViewEvent) : boolean {
    return event.startDate.getTime() < this.firstDayOfTheMonth.getTime()
  }

  private isEventIncludedBetweenDates(e: TimeLineViewEvent): boolean {
   
    return (e.endDate.getTime() > this.firstDayOfTheMonth.getTime() && e.endDate.getTime() < this.lastDayOfTheMonth.getTime())
      || e.startDate.getTime() > this.firstDayOfTheMonth.getTime() && e.startDate.getTime() < this.lastDayOfTheMonth.getTime()
  }
  
  private getDaysInMonth() : TimeLineViewElement[] {
    const daysInMonth = this.getSelectedMonthDaysCount();
    const days: TimeLineViewElement[] = [];
  
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.selectedYear, this.selectedMonthIndex, day);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      days.push({ key : date.getDate(), name: dayOfWeek });
    }
  
    return days;
  }

  private getSelectedMonthDaysCount() {
   return new Date(this.selectedYear, this.selectedMonthIndex + 1, 0).getDate();
  }
}
