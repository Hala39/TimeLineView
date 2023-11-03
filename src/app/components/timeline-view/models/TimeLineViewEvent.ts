import { EventType } from "./EventType";

export interface TimeLineViewEvent {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    typeId: number;
    type?: EventType;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    showText?: boolean;
}