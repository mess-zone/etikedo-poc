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

export function intersection(intervalA: Interval, intervalB: Interval): Interval[] {
    const start = Math.max(intervalA.start, intervalB.start);
    const end = Math.min(intervalA.end, intervalB.end);

    if (start <= end) {
        return [{ start, end }];
    }

    return [];
}

export function difference(intervalA: Interval, intervalB: Interval): Interval[] {
    const result: Interval[] = [];

    if (intervalA.start >= intervalB.end || intervalA.end <= intervalB.start) {
        result.push(intervalA); // Não há sobreposição, intervalA é totalmente mantido
    } else if (intervalA.start < intervalB.start && intervalA.end > intervalB.end) {
        // intervalB está completamente contido em intervalA, divide intervalA em duas partes
        result.push({ start: intervalA.start, end: intervalB.start - 1 });
        result.push({ start: intervalB.end + 1, end: intervalA.end });
    } else if (intervalA.start < intervalB.start) {
        // intervalA começa antes de intervalB e se sobrepõe parcialmente, adiciona parte anterior a intervalB
        result.push({ start: intervalA.start, end: intervalB.start - 1 });
    } else if (intervalA.end > intervalB.end) {
        // intervalA termina depois de intervalB e se sobrepõe parcialmente, adiciona parte posterior a intervalB
        result.push({ start: intervalB.end + 1, end: intervalA.end });
    }

    return result;
}


export function split(intervalA: Interval, intervalB: Interval): Interval[] {
    return [
        ...difference(intervalA, intervalB), 
        ...intersection(intervalA, intervalB), 
        ...difference(intervalB, intervalA)
    ]
}