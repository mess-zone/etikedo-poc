import { blend } from "../src/resource/utils/blend"
import { Interval, fuse } from "../src/resource/utils/fuse"
// jest.mock('../src/resource/utils/fuse');
// const mockedFuse = jest.mocked(fuse)

describe('Blend interval into array of intervals', () => {

    describe('empty set', () => {

        test('C start equal 0', () => {
            const set: Interval[] = []
            const C: Interval = { start: 0, end: 2, isHigh: true }
    
            const result = blend(C, set)
        
            expect(result.length).toBe(1)
            expect(result[0]).toEqual({ start: 0, end: 2, isHigh: true })
        })

        test('C start after 0', () => {
            const set: Interval[] = []
            const C: Interval = { start: 2, end: 5, isHigh: true }
    
            const result = blend(C, set)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 0, end: 2, isHigh: false })
            expect(result[1]).toEqual({ start: 2, end: 5, isHigh: true })
        })
    })

    describe('set with one interval', () => {
        test('C start equal 0', () => {
            const set: Interval[] = [{ start: 0, end: 5, isHigh: false }]
            const C: Interval = { start: 0, end: 2, isHigh: true }
    
            const result = blend(C, set)
        
            expect(result.length).toBe(2)
            expect(result[0]).toEqual({ start: 0, end: 2, isHigh: true })
            expect(result[1]).toEqual({ start: 2, end: 5, isHigh: false })
        })
        test('C start after 0', () => {
            const set: Interval[] = [{ start: 0, end: 9, isHigh: false }]
            const C: Interval = { start: 2, end: 5, isHigh: true }
    
            const result = blend(C, set)
        
            expect(result.length).toBe(3)
            expect(result[0]).toEqual({ start: 0, end: 2, isHigh: false })
            expect(result[1]).toEqual({ start: 2, end: 5, isHigh: true })
            expect(result[2]).toEqual({ start: 5, end: 9, isHigh: false })
        })
    })
})