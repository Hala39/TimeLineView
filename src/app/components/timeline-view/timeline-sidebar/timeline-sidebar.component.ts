import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventType } from 'src/app/components/timeline-view/models/EventType';
import { TimeLineViewEvent } from 'src/app/components/timeline-view/models/TimeLineViewEvent';

@Component({
  selector: 'app-timeline-sidebar',
  templateUrl: './timeline-sidebar.component.html',
  styleUrls: ['./timeline-sidebar.component.scss']
})
export class TimelineSidebarComponent implements OnChanges {

  @Input() showSidebar: boolean = false;
  @Input() event: TimeLineViewEvent | null = null;
  @Input() eventTypes: EventType[] = [];
  @Input() creationMode: boolean = false;

  @Output('showSidebarChange') showSidebarChange = new EventEmitter<boolean>();
  @Output('onEventEdit') editEventEmitter = new EventEmitter<TimeLineViewEvent>();
  @Output('onEventAdd') addEventEmitter = new EventEmitter<TimeLineViewEvent>();
  @Output('onEventDelete') deleteEventEmitter = new EventEmitter<number>();

  @ViewChild("textareaRef") textareaRef!: ElementRef<HTMLTextAreaElement>;

  editEventForm!: FormGroup;
  editModeIsOn: boolean = false;

  get parsedStartDate() {
    return this.formatDateTime(this.event?.startDate);
  }

  get parsedEndDate() {
    return this.formatDateTime(this.event?.endDate);
  }

  get isStartDateBiggerThanEndDate() {
    return this.editEventForm.get('startDate')?.value?.getTime() 
      >= this.editEventForm.get('endDate')?.value?.getTime();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["creationMode"] && changes["creationMode"].currentValue) {
      this.switchToEditMode();
    }
  }

  hideSidebar() {
    this.showSidebar = false;
    this.creationMode = false;
    this.editModeIsOn = false;
    this.showSidebarChange.emit(this.showSidebar);
  }

  switchToEditMode() {
    this.buildForm();
    this.setEventTypeToDefault();
    this.editModeIsOn = true;
  }

  resizeTextarea() {
    const element = this.textareaRef.nativeElement;
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
  }

  setStartDateValue(event: any) {
    const incomingValue = event.target.value;
    const formattedDateTime = this.parseDateTime(incomingValue);
    this.editEventForm.get("startDate")?.patchValue(formattedDateTime);
  }

  setEndDateValue(event: any) {
    const incomingValue = event.target.value;
    const formattedDateTime = this.parseDateTime(incomingValue);
    this.editEventForm.get("endDate")?.patchValue(formattedDateTime);
  }

  setEventTypeValue(event: any) {
    const incomingValue = +event.target.value;
    const newType = this.eventTypes.find(e => e.id === incomingValue);
    newType && this.setTypeANdTypeIdValues(newType);
  }

  delete() {
    this.deleteEventEmitter.emit(this.event?.id);
    this.hideSidebar();
  }
  
  cancel() {
    this.editEventForm.reset();
    this.editEventForm.markAsPristine();
    this.editModeIsOn = false;
    if (this.creationMode) this.hideSidebar();
  }

  save() {
    if (this.editEventForm.valid && !this.isStartDateBiggerThanEndDate) {
      const eventValue = this.editEventForm.value;
      this.event = eventValue;
      this.editModeIsOn = false;
      this.emitSavedValue(eventValue);
      this.hideSidebar();
    }
  }

  private emitSavedValue(eventValue: any) {
   if (this.creationMode) {
    this.addEventEmitter.emit(eventValue);
   } else {
    this.editEventEmitter.emit(eventValue);
   }
  }

  private setEventTypeToDefault() {
    if (this.creationMode) {
      const type = this.eventTypes[0];
      this.setTypeANdTypeIdValues(type);
    }
  }

  private setTypeANdTypeIdValues(type: EventType) {
    this.editEventForm.get("typeId")?.patchValue(type.id);
    this.editEventForm.get("type")?.patchValue(type);
  }

  private buildForm() {
    this.editEventForm = new FormGroup({
      id: new FormControl(this.event?.id || 0),
      name: new FormControl(this.event?.name, Validators.required),
      type: new FormControl(this.event?.type, Validators.required),
      typeId: new FormControl(this.event?.typeId, Validators.required),
      startDate: new FormControl(this.event?.startDate, Validators.required),
      endDate: new FormControl(this.event?.endDate, Validators.required),
    })
  }

  private formatDateTime(inputDate: any) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private parseDateTime(inputDate: string) {
    const [datePart, timePart] = inputDate.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const dateObject = new Date(year, month - 1, day, hours, minutes);
    return dateObject;
  }
}
