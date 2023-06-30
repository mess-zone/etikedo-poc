import { Interval, fuse } from "./fuse"

export function blend(interval: Interval, set: Interval[]) {

    const c: Interval = {
        start: interval.start,
        end: interval.end,
        isHigh: true
    }
    if(!set.length) {
        const empty: Interval = {
            start: 0,
            end: interval.end,
            isHigh: false,
        }
        return fuse(c, empty)
    }
    
    return fuse(c, set[0])
}