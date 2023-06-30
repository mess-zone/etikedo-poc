interface Interval {
    start: number,
    end: number,
    isHigh: boolean,
}

const flattenedSet: Interval[] = [
    { start: 0, end: 2, isHigh: false },
    { start: 2, end: 3, isHigh: true },
    { start: 3, end: 5, isHigh: true },
    { start: 5, end: 8, isHigh: true },
    { start: 8, end: 10, isHigh: false },
]

function fuse(c: Interval, b: Interval): Interval[] {
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

describe('Fuse intervals', () => {

    describe('no overlapping', () => {
        test('C is empty (C ends before B)', () => {
            const C: Interval = { start: -1, end: -1, isHigh: true }
            const B: Interval = { start: 0, end: 5, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 0, end: 5, isHigh: false })
            expect(C).toEqual({ start: -1, end: -1, isHigh: true })
        })
    
        test('C starts after B', () => {
            const C: Interval = { start: 5, end: 10, isHigh: true }
            const B: Interval = { start: 0, end: 5, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 0, end: 5, isHigh: false })
            expect(C).toEqual({ start: 5, end: 10, isHigh: true })
        })
    })

    describe('total overlapping', () => {
        test('C end equals B end', () => {
            const C: Interval = { start: 5, end: 7, isHigh: true }
            const B: Interval = { start: 5, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 5, end: 7, isHigh: true })
            expect(C).toEqual({ start: -1, end: -1, isHigh: true })
        })

        test('C ends after B end', () => {
            const C: Interval = { start: 5, end: 9, isHigh: true }
            const B: Interval = { start: 5, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 5, end: 7, isHigh: true })
            expect(C).toEqual({ start: 7, end: 9, isHigh: true })
        })
    })

    describe('partial overlapping', () => {
        test('C starts inside B and end equals B end', () => {
            const C: Interval = { start: 5, end: 7, isHigh: true }
            const B: Interval = { start: 2, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 2, end: 5, isHigh: true })
            expect(result[1]).toEqual({ start: 5, end: 7, isHigh: true })
            expect(C).toEqual({ start: -1, end: -1, isHigh: true })
        })
        test('C starts inside B and ends after B', () => {
            const C: Interval = { start: 5, end: 9, isHigh: true }
            const B: Interval = { start: 2, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 2, end: 5, isHigh: true })
            expect(result[1]).toEqual({ start: 5, end: 7, isHigh: true })
            expect(C).toEqual({ start: 7, end: 9, isHigh: true })
        })
        test('C start equals B start and ends inside B', () => {
            const C: Interval = { start: 2, end: 5, isHigh: true }
            const B: Interval = { start: 2, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 2, end: 5, isHigh: true })
            expect(result[1]).toEqual({ start: 5, end: 7, isHigh: true })
            expect(C).toEqual({ start: -1, end: -1, isHigh: true })
        })
    })
})