export interface Interval {
    start: number;
    end: number;
}

export function union(intervalA: Interval, intervalB: Interval): Interval[] {
    const result: Interval[] = [];

    if (intervalA.end < intervalB.start || intervalB.end < intervalA.start) {
        result.push(intervalA, intervalB); // Os intervalos não se sobrepõem
    } else {
        const start = Math.min(intervalA.start, intervalB.start);
        const end = Math.max(intervalA.end, intervalB.end);
        result.push({ start, end });
    }

    return result;
}
