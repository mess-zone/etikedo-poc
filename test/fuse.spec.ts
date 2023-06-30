import { Interval, fuse } from "../src/resource/utils/fuse"

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
            expect(result[0]).toEqual({ start: 2, end: 5, isHigh: false })
            expect(result[1]).toEqual({ start: 5, end: 7, isHigh: true })
            expect(C).toEqual({ start: -1, end: -1, isHigh: true })
        })
        test('C starts inside B and ends after B', () => {
            const C: Interval = { start: 5, end: 9, isHigh: true }
            const B: Interval = { start: 2, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 2, end: 5, isHigh: false })
            expect(result[1]).toEqual({ start: 5, end: 7, isHigh: true })
            expect(C).toEqual({ start: 7, end: 9, isHigh: true })
        })
        test('C start equals B start and ends inside B', () => {
            const C: Interval = { start: 2, end: 5, isHigh: true }
            const B: Interval = { start: 2, end: 7, isHigh: false }
            const result = fuse(C, B)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 2, end: 5, isHigh: true })
            expect(result[1]).toEqual({ start: 5, end: 7, isHigh: false })
            expect(C).toEqual({ start: -1, end: -1, isHigh: true })
        })
    })
})