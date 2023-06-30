import { blend } from "../src/resource/utils/blend"
import { fuse } from "../src/resource/utils/fuse"
jest.mock('../src/resource/utils/fuse');
const mockedFoo = jest.mocked(fuse)

describe('Blend intreval into array of intervals', () => {
    test('C is empty (C ends before B)', () => {
        const C = { start: -1, end: -1, isHigh: true }
        const B = { start: 0, end: 5, isHigh: false }

        mockedFoo.mockImplementation((c, b) => {
            console.log(c, b)
            C.start = 2
            C.end = 2
            return [{ start: 0, end: 5, isHigh: false }]
        })


        const result = blend(C, B)
    
        expect(result.length).toBe(1)
        expect(result[0]).toEqual({ start: 0, end: 5, isHigh: false })
        expect(C).toEqual({ start: 2, end: 2, isHigh: true })
    })
})