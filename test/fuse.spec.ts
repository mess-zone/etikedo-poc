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
    if(!c) { // c is empty
        return [b]
    }
    if(c.start > b.end - 1) { // c starts after b ends
        return [b]
    }

    /**
     * total overlapping: (B intersecção C) == B
     */
    if(c.start == b.start && c.end >= b.end) { // c end is equal or greater than b end
        return [{ start: b.start, end: b.end, isHigh: true }]
    }

    /**
     * partial overlapping: ((B intersecção C) union (B minus C)) == B
     */
    if(c.start > b.start) { // c starts inside b
        return [
            { start: b.start, end: c.start, isHigh: true },
            { start: c.start, end: b.end, isHigh: true },
        ]
    } else { //c.end < b.end (c ends inside b)
        return [
            { start: b.start, end: c.end, isHigh: true },
            { start: c.end, end: b.end, isHigh: true },
        ]
    }
}

describe('Fuse intervals', () => {

    describe('no overlapping', () => {
        test('C is empty (C ends before B)', () => {
            const C: Interval = null
            const B: Interval = { start: 0, end: 5, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 0, end: 5, isHigh: false })
        })
    
        test('C starts after B', () => {
            const C: Interval = { start: 5, end: 10, isHigh: true }
            const B: Interval = { start: 0, end: 5, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 0, end: 5, isHigh: false })
        })
    })

    describe('total overlapping', () => {
        test('C end equals B end', () => {
            const C: Interval = { start: 5, end: 7, isHigh: true }
            const B: Interval = { start: 5, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 5, end: 7, isHigh: true })
        })

        test('C ends after B end', () => {
            const C: Interval = { start: 5, end: 9, isHigh: true }
            const B: Interval = { start: 5, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 5, end: 7, isHigh: true })
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
        })
        test('C starts inside B and ends after B', () => {
            const C: Interval = { start: 5, end: 9, isHigh: true }
            const B: Interval = { start: 2, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 2, end: 5, isHigh: true })
            expect(result[1]).toEqual({ start: 5, end: 7, isHigh: true })
        })
        test('C start equals B start and ends inside B', () => {
            const C: Interval = { start: 2, end: 5, isHigh: true }
            const B: Interval = { start: 2, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 2, end: 5, isHigh: true })
            expect(result[1]).toEqual({ start: 5, end: 7, isHigh: true })
        })
    })
})