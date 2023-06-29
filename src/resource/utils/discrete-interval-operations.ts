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
    const c = interval

    for(const subset of flattenedSet) {
        if(c.start < subset.start) { // C starts before S
            if(c.end < subset.start) {
                results.push({ start: c.start, end: c.end})
                results.push(subset)
            } else if(c.end == subset.start) {
                results.push({ start: c.start, end: subset.start - 1})
                results.push({ start: subset.start, end: c.end})
                results.push({ start: c.end + 1, end: subset.end})
            } else if(c.end > subset.start && c.end < subset.end) {
                results.push({ start: c.start, end: subset.start - 1})
                results.push({ start: subset.start, end: c.end})
                results.push({ start: c.end + 1, end: subset.end})
            } else if(c.end == subset.end) {
                results.push({ start: c.start, end: subset.start - 1})
                // as duas linhas abaixo são diferentes das anteriores
                results.push({ start: subset.start, end: subset.end - 1})
                results.push({ start: c.end, end: subset.end})
            } else { // c.end > subset.end
                results.push({ start: c.start, end: subset.start - 1})
                // as duas linhas abaixo são diferentes das anteriores
                results.push({ start: subset.start, end: subset.end})
                results.push({ start: subset.end + 1, end: c.end})
            }
            
        }
        // else if (subset.start < c.start && subset.end > c.end) {
        //     // c está completamente contido em subset, divide subset em duas partes
        //     results.push({ start: subset.start, end: c.start - 1 });
        //     results.push({ start: c.end + 1, end: subset.end });
        // } else if (subset.start < c.start) {
        //     // subset começa antes de c e se sobrepõe parcialmente, adiciona parte anterior a c
        //     results.push({ start: subset.start, end: c.start - 1 });
        // } else if (subset.end > c.end) {
        //     // subset termina depois de c e se sobrepõe parcialmente, adiciona parte posterior a c
        //     results.push({ start: c.end + 1, end: subset.end });
        // }
        
    }

    return results
}