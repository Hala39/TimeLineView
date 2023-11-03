import { TimeLineViewElement } from "../models/TimeLineViewElement";

export const hours: TimeLineViewElement[] = getHours();

function getHours() {
    const hoursOfDayCount = 24;
    let hours: TimeLineViewElement[] = [];
    for (let index = 0; index < hoursOfDayCount; index++) {
        hours.push({key: index, name: `${index}:00`})
    }
    return hours;
}