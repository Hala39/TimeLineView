import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { daysOfTheWeek } from 'src/app/components/timeline-view/data/daysOfTheWeek';
import { hours } from 'src/app/components/timeline-view/data/hours';
import { months } from 'src/app/components/timeline-view/data/months';
import { years } from 'src/app/components/timeline-view/data/years';
import { EventType } from 'src/app/components/timeline-view/models/EventType';
import { TimelineView } from 'src/app/components/timeline-view/models/TimelineView';
import { TimeLineViewElement } from 'src/app/components/timeline-view/models/TimeLineViewElement';
import { TimeLineViewEvent } from 'src/app/components/timeline-view/models/TimeLineViewEvent';

@Component({
  selector: 'app-timeline-view',
  templateUrl: './timeline-view.component.html',
  styleUrls: ['./timeline-view.component.scss']
})
export class TimelineViewComponent implements OnChanges, AfterViewInit {

  @ViewChild("timeLineRef") timeLineRef!: ElementRef<SVGElement>;

  currentDate: Date = new Date();

  @Input() eventTypes: EventType[] = [];
  @Input() events: TimeLineViewEvent[] = [];
  @Input() timeLineView: TimelineView = TimelineView.Date;
  @Input() selectedMonthIndex: number = this.currentDate.getMonth();
  @Input() selectedDate: number = this.currentDate.getDate();
  @Input() selectedDateName: string = "";
  @Input() selectedYear: number = this.currentDate.getFullYear();
  
  @Output('onDeleteEvent') deleteEmitter = new EventEmitter<number>();
  @Output('onAddEvent') addEmitter = new EventEmitter<TimeLineViewEvent>();
  @Output('onEditEvent') editEmitter = new EventEmitter<TimeLineViewEvent>();

  months = months;
  years = years;
  daysOfTheWeek = daysOfTheWeek;
  currentMinute: number = this.currentDate.getMinutes();
  currentHour: number = this.currentDate.getHours();
  currentDay: number = this.currentDate.getDate();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  xAxisElements: TimeLineViewElement[] = [];
  width: number = 0;
  height: number = 0;
  topMargin: number = 0;
  xFactor: number = 0;
  yFactor: number = 0;
  spaceBefore: number = 2;
  showSidebar = false;
  creationMode = false;
  sidebarFocusedEvent: TimeLineViewEvent | null = null;
  includedTypes: number[] = [];

  // Facts
  millisecondsPerSecond = 1000;
  secondsPerMinute = 60;
  minutesPerHour = 60;
  hoursPerDay = 24;
  daysPerMonth = 30;
  monthsPerYear = 12;

  get showTodayIndicator() {
    let isTodayInTheScene: boolean = false;
    switch (this.timeLineView) {
      case TimelineView.Year:
        isTodayInTheScene = this.selectedYear === this.currentYear;
        break;
    
      case TimelineView.Month:
        isTodayInTheScene = this.selectedYear === this.currentYear 
          && this.selectedMonthIndex === this.currentMonth;
        break;

      case TimelineView.Date:
        isTodayInTheScene = this.selectedYear === this.currentYear 
          && this.selectedMonthIndex === this.currentMonth
          && this.selectedDate === this.currentDay;
        break;
    }

    return isTodayInTheScene;
  }

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

  includedEvents: TimeLineViewEvent[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["eventTypes"]) {
      this.includedTypes = this.eventTypes.map(t => t.id)
    }
  }

  ngAfterViewInit() {
    this.setMeasurements();
  }

  setMeasurements() {
    this.initializeWidth();
    this.initializeXYFactor();
    this.initializeXAxisElements();
    this.initializeViewBoxDimensions();
    this.initializeEventsTypes();
    this.initializeEventsCoordinates();
  }

  setSelectedYear(event: Event) {
    const year = +(event as any).target.value;
    this.selectedYear = year;
    this.setMeasurements();
  }

  setSelectedMonth(event: Event) {
    const monthIndex = +(event as any).target.value;
    this.selectedMonthIndex = monthIndex;
    this.switchToMonthViewIfMonthChangedAndDateViewWasSelected();
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
        this.selectedDateName = xAxisElement.name;
        break;

      default:
        break;
    }
    
    this.setMeasurements();
  }

  resetToToday() {
    this.selectedYear = this.currentYear;
    this.selectedMonthIndex = this.currentMonth;
    this.selectedDate = this.currentDay;
    this.selectedDateName = this.daysOfTheWeek[this.currentDate.getDay() - 1];
    this.setMeasurements();
  }

  previewEvent(event: TimeLineViewEvent) {
    this.sidebarFocusedEvent = event;
    this.showSidebar = true;
  }

  resetFocusedEvent() {
    this.sidebarFocusedEvent = null;
    this.creationMode = false;
  }

  setAddedEvent(event: TimeLineViewEvent) {
    this.events.push(event);
    this.addEmitter.emit(event);
    this.setMeasurements();
  }

  setEditedEvent(event: TimeLineViewEvent) {
    const eventIndex = this.events.findIndex(e => e.id === event.id);
    this.events[eventIndex] = event;
    this.editEmitter.emit(event);
    this.setMeasurements();
  }

  deleteEvent(eventId: number) {
    this.events = this.events.filter(e => e.id !== eventId);
    this.deleteEmitter.emit(eventId);
    this.setMeasurements();
  }

  addEvent() {
    this.creationMode = true;
    this.showSidebar = true;
  }

  toggleType(typeId: number) {
    if (this.includedTypes.includes(typeId)) {
      this.includedTypes = this.includedTypes.filter(t => t !== typeId);
    } else {
      this.includedTypes.push(typeId);
    }
  }

  before() {
    switch (this.timeLineView) {
      case TimelineView.Year:
        this.getPreviousYearData();
        break;

      case TimelineView.Month:
        this.getPreviousMonthData();
        break;

      case TimelineView.Date:
        this.getPreviousDateData();
        break;
    }
  }

  after() {
    switch (this.timeLineView) {
      case TimelineView.Year:
        this.getNextYearData();
        break;
    
      case TimelineView.Month:
        this.getNextMonthData();
        break;

      case TimelineView.Date:
        this.getNextDateData();
        break;
    }
  }

  private getPreviousYearData() {
    this.selectedYear -= 1;
    this.setMeasurements();
  }

  private getPreviousMonthData() {
    if (this.selectedMonthIndex === 0) {
      this.selectedMonthIndex = 11;
      this.selectedYear -= 1;
    } else {
      this.selectedMonthIndex -= 1;
    }

    this.setMeasurements();
  }

  private getPreviousDateData() {
    const selectedDate = this.getDateFromSelectedValues();
    const millisecondsPerDay = this.millisecondsPerSecond * this.secondsPerMinute * this.minutesPerHour * this.hoursPerDay;
    const nexDate = new Date(selectedDate.getTime() - millisecondsPerDay);
    this.setSelectedValuesByDate(nexDate);
    this.setMeasurements();
  }

  private getNextYearData() {
    this.selectedYear += 1;
    this.setMeasurements();
  }

  private getNextMonthData() {
    if (this.selectedMonthIndex === 11) {
      this.selectedMonthIndex = 0;
      this.selectedYear += 1;
    } else {
      this.selectedMonthIndex += 1;
    }

    this.setMeasurements();
  }

  private getNextDateData() {
    const selectedDate = this.getDateFromSelectedValues();
    const millisecondsPerDay = this.millisecondsPerSecond * this.secondsPerMinute * this.minutesPerHour * this.hoursPerDay;
    const nexDate = new Date(selectedDate.getTime() + millisecondsPerDay);
    this.setSelectedValuesByDate(nexDate);
    this.setMeasurements();
  }

  private switchToMonthViewIfMonthChangedAndDateViewWasSelected() {
   if (this.timeLineView === TimelineView.Date) {
     this.timeLineView = TimelineView.Month;
   }
  }

  private initializeWidth() {
    this.timeLineRef.nativeElement.style.width = `max(100%, 1600px)`;
  }

  private initializeXYFactor() {
    switch (this.timeLineView) {
      case TimelineView.Year:
        this.xFactor = this.getSelectedMonthDaysCount();
        this.yFactor = this.monthsPerYear * 0.5;
        break;
      
      case TimelineView.Month:
        this.xFactor = this.hoursPerDay;
        this.yFactor = this.daysPerMonth * 0.4;
        break;

      case TimelineView.Date:
          this.xFactor = this.minutesPerHour;
          this.yFactor = this.hoursPerDay;
          break;   
    }

    this.topMargin = this.yFactor * 2;
  }

  private initializeViewBoxDimensions() {
    this.width = this.xAxisElements.length * this.xFactor; 
    this.height = 700;
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
    const rows: TimeLineViewEvent[][] = this.splitEventsToEventsRows(this.includedEvents);
    this.includedEvents.forEach((event: TimeLineViewEvent) => {
      const rowIndex: number = rows.findIndex(r => r.some(e => e.id === event.id));
      const startMonth = event.startDate.getMonth();
      const startDate = event.startDate.getDate();
      const isStartDateBeforeTheFirstDay = this.isStartDateBeforeTheFirstDay(event);
      const x = isStartDateBeforeTheFirstDay ? -1 : (startMonth) * this.xFactor + startDate;
      const y = (this.yFactor + this.yFactor/2) * rowIndex + this.topMargin + this.yFactor/2;
      const differenceInTime = isStartDateBeforeTheFirstDay ? 
        event.endDate.getTime() - this.firstDay.getTime() : event.endDate.getTime() - event.startDate.getTime();
      const differenceInDays = 
        differenceInTime / this.millisecondsPerSecond / this.secondsPerMinute / this.minutesPerHour / this.hoursPerDay / this.daysPerMonth * this.xFactor;
      const width = differenceInDays;
      const height = this.yFactor;
      event.x = x;
      event.y = y;
      event.width = width;
      event.height = height;
      event.showText = differenceInDays > this.daysPerMonth/2;
    })
  }

  private setEventsInDays() {
    this.includedEvents = this.events.filter(e => this.isEventIncludedBetweenDates(e));
    const rows: TimeLineViewEvent[][] = this.splitEventsToEventsRows(this.includedEvents);
    this.includedEvents.forEach((event: TimeLineViewEvent) => {
      const rowIndex: number = rows.findIndex(r => r.some(e => e.id === event.id));
      const startDay = event.startDate.getDate();
      const startHour = event.startDate.getHours();
      const isStartDateBeforeTheFirstDay = this.isStartDateBeforeTheFirstDay(event);
      const x = isStartDateBeforeTheFirstDay ? -1 : (startDay - 1) * this.xFactor + startHour;
      const y = (this.yFactor + this.yFactor/2) * rowIndex + this.topMargin + this.yFactor/2;
      const differenceInTime = isStartDateBeforeTheFirstDay ? 
        event.endDate.getTime() - this.firstDay.getTime() : event.endDate.getTime() - event.startDate.getTime();
      const differenceInHours = 
        differenceInTime / this.millisecondsPerSecond / this.secondsPerMinute / this.minutesPerHour / this.hoursPerDay * this.xFactor;
      const width = differenceInHours;
      const height = this.yFactor;
      event.x = x;
      event.y = y;
      event.width = width;
      event.height = height;
      event.showText = differenceInHours > this.hoursPerDay;
    })  
  }

  private setEventsInHours() {
    this.includedEvents = this.events.filter(e => this.isEventIncludedBetweenDates(e));
    const rows: TimeLineViewEvent[][] = this.splitEventsToEventsRows(this.includedEvents);    
    this.includedEvents.forEach((event: TimeLineViewEvent) => {
      const rowIndex: number = rows.findIndex(r => r.some(e => e.id === event.id));
      const startMinute = event.startDate.getMinutes();
      const startHour = event.startDate.getHours();
      const isStartDateBeforeTheFirstDay = this.isStartDateBeforeTheFirstDay(event);
      const x = isStartDateBeforeTheFirstDay ? -1 : startHour * this.xFactor + startMinute;
      const y = (this.yFactor + this.yFactor/2) * rowIndex + this.topMargin + this.yFactor/2;;
      const differenceInTime = isStartDateBeforeTheFirstDay ? 
        event.endDate.getTime() - this.firstDay.getTime() : event.endDate.getTime() - event.startDate.getTime();
      const differenceInHours = 
        differenceInTime / this.millisecondsPerSecond / this.secondsPerMinute / this.minutesPerHour * this.xFactor;
      const width = differenceInHours;
      const height = this.yFactor;
      event.x = x;
      event.y = y;
      event.width = width;
      event.height = height;
      event.showText = differenceInHours > this.minutesPerHour;
    })  
  }

  private splitEventsToEventsRows(events: TimeLineViewEvent[]) {
    events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const rows: TimeLineViewEvent[][] = [];
    for (const event of events) {
      const row = rows.find((r) => !r.some((e) => e.startDate < event.endDate && e.endDate > event.startDate));
      if (row) {
        row.push(event);
      } else {
        rows.push([event]);
      }
    }

    this.prolongHeightIfNotSufficient(rows.length);
    return rows;
  }

  private prolongHeightIfNotSufficient(rowsCount: number) {
    let multiplier = rowsCount < 20 ? 20 : rowsCount;
    this.height = (this.yFactor + this.yFactor/2) * multiplier + this.topMargin + this.yFactor/2; 
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

  private getDateFromSelectedValues() {
    return new Date(this.selectedYear, this.selectedMonthIndex, this.selectedDate)
  }

  private setSelectedValuesByDate(date: Date) {
    this.selectedYear = date.getFullYear();
    this.selectedMonthIndex = date.getMonth();
    this.selectedDate = date.getDate();
  }
  
}
