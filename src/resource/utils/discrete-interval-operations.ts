export interface Interval {
    start: number;
    end: number;
}

export function union(intervalA: Interval, intervalB: Interval): Interval[] {
    const result: Interval[] = [];

    if (intervalA.end < (intervalB.start - 1) || intervalB.end < (intervalA.start - 1)) {
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


/**
 * Retona os conjuntos A-B, A^B, B-A
 * @param intervalA 
 * @param intervalB 
 */
export function split(intervalA: Interval, intervalB: Interval): Interval[] {
    return [
        ...difference(intervalA, intervalB), 
        ...intersection(intervalA, intervalB), 
        ...difference(intervalB, intervalA)
    ]
}

export function flatten(flattenedSet: Interval[], interval: Interval): Interval[] {
    const results: Interval[] = []
    let c = { start: interval.start, end: interval.end}

    for(const subset of flattenedSet) {
        if(c.start < subset.start) {
            if(c.end <= subset.start) {
                // results.push({ start: c.start, end: c.end})
                results.push(subset)
            } else if(c.end > subset.start && c.end < subset.end) {
                // results.push({ start: c.start, end: subset.start})
                results.push({ start: subset.start, end: c.end})
                results.push({ start: c.end, end: subset.end})
                c.end = subset.start
            } else if(c.end == subset.end) {
                results.push({ start: subset.start, end: subset.end})
                // results.push({ start: c.start, end: subset.start})
                c.end = subset.start
            } else { // c.end > subset.end
                results.push({ start: subset.start, end: subset.end})
                results.push({ start: subset.end, end: c.end})
                // results.push({ start: c.start, end: subset.start})
                c.end = subset.start
            }
        } else if(c.start == subset.start) {
            if(c.end - 1 <= subset.start) {
                // results.push({ start: c.start, end: c.end})
                results.push({ start: c.end, end: subset.end})
            } else if(c.end - 1 > subset.start && c.end < subset.end) {
                results.push({ start: c.end, end: subset.end})
                // results.push({ start: c.start, end: c.end})
            } else if(c.end == subset.end) {
                // results.push({ start: c.start, end: c.end})
            } else if(c.end > subset.end) { // c.end > subset.end
                results.push({ start: subset.end, end: c.end})
                // results.push({ start: c.start, end: subset.end})
                c.end = subset.end
            }
        } else if(c.start > subset.start && c.start < subset.end - 1) {
            if(c.end < subset.end) {
                results.push({ start: subset.start, end: c.start})
                results.push({ start: c.end, end: subset.end})
                // results.push({ start: c.start, end: c.end})
            } else if(c.end == subset.end) {
                results.push({ start: subset.start, end: c.start})
                // results.push({ start: c.start, end: c.end})  
            } else { // c.end > subset.end
                results.push({ start: subset.start, end: c.start})
                results.push({ start: subset.end, end: c.end}) 
                // results.push({ start: c.start, end: subset.end}) 
                c.end = subset.end
            }
        } else if(c.start == subset.end - 1) {
            if(c.end <= subset.end) {
                results.push({ start: subset.start, end: c.start})
                // results.push({ start: c.start, end: subset.end}) 
                c.end = subset.end
            } else if(c.end > subset.end) {
                results.push({ start: subset.start, end: c.start})
                // results.push({ start: subset.end, end: c.end}) 
                results.push({ start: c.start, end: subset.end}) 
                c.start = subset.end
            }
        } else if(c.start > subset.end - 1) {
            results.push({ start: subset.start, end: subset.end}) 
            // results.push({ start: c.start, end: c.end}) 
        }
 
    }

    if(c) {
        results.push(c)
    }

    return results
}