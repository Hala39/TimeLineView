import { TimeLineViewElement } from "../models/TimeLineViewElement";

export const years: TimeLineViewElement[] = getYears();

function getYears() {
    const firstYear = 1971;
    const lastYear = 2300;
    let hours: TimeLineViewElement[] = [];
    for (let index = firstYear; index < lastYear; index++) {
        hours.push({key: index, name: index.toString()})
    }
    return hours;
}