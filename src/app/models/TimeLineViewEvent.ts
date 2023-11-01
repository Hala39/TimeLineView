import { EventType } from "./EventType";

export interface TimeLineViewEvent {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    typeId: number;
    type?: EventType;
    startYear?: number;
    startMonth?: number;
    startDay?: number;
    startHour?: number;
    startMinute?: number;
    endYear?: number;
    endMonth?: number;
    endDay?: number;
    endHour?: number;
    endMinute?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    showText?: boolean;
}