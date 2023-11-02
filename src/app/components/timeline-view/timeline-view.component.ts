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
  selectedDate: number = this.currentDate.getDate();
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

  get firstDay() {
    let date: Date = new Date();
    switch (this.timeLineView) {
      case TimelineView.Year:
        date = new Date(this.selectedYear, 0, 1);
        break;
    
      case TimelineView.Month:
        date = new Date(this.selectedYear, this.selectedMonthIndex, 1);
        break;
      
      case TimelineView.Date:
        date = new Date(this.selectedYear, this.selectedMonthIndex, this.selectedDate);
        break;
        
        default:
          break;
        }
    return date;
  };

  get lastDay() {
    let date: Date = new Date();
    switch (this.timeLineView) {
      case TimelineView.Year:
        date = new Date(this.selectedYear, 12, 0);
        break;
    
      case TimelineView.Month:
        date = new Date(this.selectedYear, this.selectedMonthIndex + 1, 0);
        break;
      
      case TimelineView.Date:
        date = new Date(this.selectedYear, this.selectedMonthIndex, this.selectedDate + 1);
        break;
        
        default:
          break;
        }

    return date;
  };
  
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
    },
    {
      id: 6,
      name: "6 Meeting with Hala",
      startDate: new Date(2023, 11, 6, 3, 0, 0),
      endDate: new Date(2025, 10, 11, 6, 0, 0),
      typeId: 3,
    },
    {
      id: 6,
      name: "6 Meeting with Hala",
      startDate: new Date(2023, 10, 1, 3, 0, 0),
      endDate: new Date(2023, 10, 1, 6, 0, 0),
      typeId: 3,
    },
    {
      id: 7,
      name: "7 Meeting with Hala",
      startDate: new Date(2023, 10, 1, 8, 0, 0),
      endDate: new Date(2023, 10, 1, 21, 0, 0),
      typeId: 2,
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
    this.initializeEventsTypes();
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

  zoomOutToYears() {
    this.timeLineView = TimelineView.Year;
    this.setMeasurements();
  }

  zoomOutToMonths() {
    this.timeLineView = TimelineView.Month;
    this.setMeasurements();
  }

  zoomIn(xAxisElement: TimeLineViewElement) {
    switch (this.timeLineView) {
      case TimelineView.Year:
        this.timeLineView = TimelineView.Month;
        this.selectedMonthIndex = xAxisElement.key;
        break;
    
      case TimelineView.Month:
        this.timeLineView = TimelineView.Date;
        this.selectedDate = xAxisElement.key;
        break;

      case TimelineView.Date:
        // this.timeLineView = TimelineView.Hour;
        // this.selectedMonthIndex = xAxisElement.key;
        break;

      default:
        break;
    }
    
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

  private initializeEventsTypes() {
    this.events.forEach((event: TimeLineViewEvent) => {
      event.type = this.eventTypes.find(e => e.id === event.typeId);
    })
  }

  private initializeEventsCoordinates() {
    switch (this.timeLineView) {
      case TimelineView.Year:
        this.setEventsInMonths();
        break;

      case TimelineView.Month:
        this.setEventsInDays();
        break;
    
      case TimelineView.Date:
        this.setEventsInHours();
        break;

      default:
        break;
    }
  }

  private setEventsInMonths() {
    this.includedEvents = this.events.filter(e => this.isEventIncludedBetweenDates(e));
    this.includedEvents.forEach((event: TimeLineViewEvent, index: number) => {
      const startMonth = event.startDate.getMonth();
      const startDate = event.startDate.getDate();
      const isStartDateBeforeTheFirstDay = this.isStartDateBeforeTheFirstDay(event);
      const x = isStartDateBeforeTheFirstDay ? -1 : (startMonth) * this.xFactor + startDate;
      const y = this.topMargin * index + this.topMargin;
      const differenceInTime = isStartDateBeforeTheFirstDay ? 
        event.endDate.getTime() - this.firstDay.getTime() : event.endDate.getTime() - event.startDate.getTime();
        const differenceInDays = 
        differenceInTime / this.millisecondsPerSecond / this.secondsPerMinute / this.minutesPerHour / this.hoursPerDay / this.daysPerMonth * this.xFactor;
        const width = differenceInDays;
        const height = 20;
        event.x = x;
        event.y = y;
        event.width = width;
        event.height = height;
        event.showText = differenceInDays > this.daysPerMonth;
    })
  }

  private setEventsInDays() {
    this.includedEvents = this.events.filter(e => this.isEventIncludedBetweenDates(e));
    this.includedEvents.forEach((event: TimeLineViewEvent, index: number) => {
      const startDay = event.startDate.getDate();
      const startHour = event.startDate.getHours();
      const isStartDateBeforeTheFirstDay = this.isStartDateBeforeTheFirstDay(event);
      const x = isStartDateBeforeTheFirstDay ? -1 : (startDay - 1) * this.xFactor + startHour;
      const y = this.topMargin * index + this.topMargin;
      const differenceInTime = isStartDateBeforeTheFirstDay ? 
        event.endDate.getTime() - this.firstDay.getTime() : event.endDate.getTime() - event.startDate.getTime();
      const differenceInHours = 
        differenceInTime / this.millisecondsPerSecond / this.secondsPerMinute / this.minutesPerHour / this.hoursPerDay * this.xFactor;
      const width = differenceInHours;
      const height = 20;
      event.x = x;
      event.y = y;
      event.width = width;
      event.height = height;
      event.showText = differenceInHours > this.hoursPerDay;
    })  
  }

  private setEventsInHours() {
    this.includedEvents = this.events.filter(e => this.isEventIncludedBetweenDates(e));    
    this.includedEvents.forEach((event: TimeLineViewEvent, index: number) => {
      const startMinute = event.startDate.getMinutes();
      const startHour = event.startDate.getHours();
      const isStartDateBeforeTheFirstDay = this.isStartDateBeforeTheFirstDay(event);
      const x = isStartDateBeforeTheFirstDay ? -1 : startHour * this.xFactor + startMinute;
      const y = this.topMargin * index + this.topMargin;
      const differenceInTime = isStartDateBeforeTheFirstDay ? 
        event.endDate.getTime() - this.firstDay.getTime() : event.endDate.getTime() - event.startDate.getTime();
      const differenceInHours = 
        differenceInTime / this.millisecondsPerSecond / this.secondsPerMinute / this.minutesPerHour * this.xFactor;
      const width = differenceInHours;
      const height = 20;
      event.x = x;
      event.y = y;
      event.width = width;
      event.height = height;
      event.showText = differenceInHours > this.minutesPerHour;
    })  
  }

  private isStartDateBeforeTheFirstDay(event: TimeLineViewEvent) : boolean {
    return event.startDate.getTime() < this.firstDay.getTime()
  }

  private isEventIncludedBetweenDates(e: TimeLineViewEvent): boolean {   
    return (e.endDate.getTime() > this.firstDay.getTime() && e.endDate.getTime() < this.lastDay.getTime())
      || e.startDate.getTime() > this.firstDay.getTime() && e.startDate.getTime() < this.lastDay.getTime()
      || e.startDate.getTime() < this.firstDay.getTime() && e.endDate.getTime() > this.lastDay.getTime()
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
