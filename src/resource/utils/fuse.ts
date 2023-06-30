export interface Interval {
    start: number,
    end: number,
    isHigh: boolean,
}

export function fuse(c: Interval, b: Interval): Interval[] {
    /**
     * no overlapping
     */
    if(c.start == -1) { // c is empty
        return [b]
    }
    if(c.start > b.end - 1) { // c starts after b ends
        return [b]
    }


    const cOriginalStart = c.start
    const cOriginalEnd = c.end

    // (c - b) substitui c pelo remanescente que não se sobrepões com b
    if(b.end < c.end) {
        c.start = b.end
    } else {
        c.start = -1
        c.end = -1
    }

    /**
     * total overlapping: (B intersecção C) == B
     */
    if(cOriginalStart == b.start && cOriginalEnd >= b.end) { // c end is equal or greater than b end
        return [{ start: b.start, end: b.end, isHigh: true }]
    }

    /**
     * partial overlapping: ((B intersecção C) union (B minus C)) == B
     */
    if(cOriginalStart > b.start) { // c starts inside b
        return [
            { start: b.start, end: cOriginalStart, isHigh: true },
            { start: cOriginalStart, end: b.end, isHigh: true },
        ]
    } else { //c.end < b.end (c ends inside b)
        return [
            { start: b.start, end: cOriginalEnd, isHigh: true },
            { start: cOriginalEnd, end: b.end, isHigh: true },
        ]
    }
}
