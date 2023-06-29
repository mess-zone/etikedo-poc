import { Interval, union, intersection, difference, split } from '../src/resource/utils/interval-operations'

describe('union', () => {
  // Caso 1: Intervalos não se sobrepõem
  it('should return both intervals when they do not overlap', () => {
    const interval1 = { start: 1, end: 3 };
    const interval2 = { start: 5, end: 7 };
    const expectedResult = [interval1, interval2];

    const result = union(interval1, interval2);

    expect(result).toEqual(expectedResult);
  });

  // Caso 2: Intervalos se sobrepõem parcialmente
  it('should return the merged interval when the intervals partially overlap', () => {
    const interval3 = { start: 1, end: 5 };
    const interval4 = { start: 3, end: 7 };
    const expectedResult = [{ start: 1, end: 7 }];

    const result = union(interval3, interval4);

    expect(result).toEqual(expectedResult);
  });

  // Caso 3: Intervalos são iguais
  it('should return one interval when the intervals are equal', () => {
    const interval5 = { start: 0, end: 10 };
    const interval6 = { start: 0, end: 10 };
    const expectedResult = [interval5];

    const result = union(interval5, interval6);

    expect(result).toEqual(expectedResult);
  });

  // Caso 4: Um intervalo está totalmente contido no outro
  it('should return the larger interval when one interval is completely contained within the other', () => {
    const interval7 = { start: 2, end: 8 };
    const interval8 = { start: 3, end: 7 };
    const expectedResult = [{ start: 2, end: 8 }];

    const result = union(interval7, interval8);

    expect(result).toEqual(expectedResult);
  });

  // Caso 5: Intervalos não se sobrepõem e um começa após o outro
  it('should return both intervals when they do not overlap and one starts after the other', () => {
    const interval9 = { start: 1, end: 3 };
    const interval10 = { start: 4, end: 6 };
    const expectedResult = [interval9, interval10];

    const result = union(interval9, interval10);

    expect(result).toEqual(expectedResult);
  });
});

describe('intersection', () => {
    // Caso 1: Intervalos não se sobrepõem
    it('should return empty when the intervals do not overlap', () => {
      const interval1 = { start: 1, end: 3 };
      const interval2 = { start: 5, end: 7 };
      const expectedResult: Interval[] = [];
  
      const result = intersection(interval1, interval2);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 2: Intervalos se sobrepõem parcialmente
    it('should return the intersection interval when the intervals partially overlap', () => {
      const interval3 = { start: 1, end: 5 };
      const interval4 = { start: 3, end: 7 };
      const expectedResult = [{ start: 3, end: 5 }];
  
      const result = intersection(interval3, interval4);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 3: Intervalos são iguais
    it('should return the interval itself when the intervals are equal', () => {
      const interval5 = { start: 0, end: 10 };
      const interval6 = { start: 0, end: 10 };
      const expectedResult = [{ start: 0, end: 10 }];
  
      const result = intersection(interval5, interval6);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 4: Um intervalo está totalmente contido no outro
    it('should return the smaller interval when one interval is completely contained within the other', () => {
      const interval7 = { start: 2, end: 8 };
      const interval8 = { start: 3, end: 7 };
      const expectedResult = [{ start: 3, end: 7 }];
  
      const result = intersection(interval7, interval8);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 5: Intervalos não se sobrepõem e um começa após o outro
    it('should return empty when the intervals do not overlap and one starts after the other', () => {
      const interval9 = { start: 1, end: 3 };
      const interval10 = { start: 4, end: 6 };
      const expectedResult: Interval[] = [];
  
      const result = intersection(interval9, interval10);
  
      expect(result).toEqual(expectedResult);
    });
});

describe('difference', () => {
    // Caso 1: Intervalos não se sobrepõem
    it('should return intervalA when the intervals do not overlap', () => {
      const interval1 = { start: 1, end: 3 };
      const interval2 = { start: 5, end: 7 };
      const expectedResult = [interval1];
  
      const result = difference(interval1, interval2);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 2: Intervalo A totalmente contido no intervalo B
    it('should return empty when intervalA is fully contained within intervalB', () => {
      const interval3 = { start: 1, end: 5 };
      const interval4 = { start: 0, end: 10 };
      const expectedResult: Interval[] = [];
  
      const result = difference(interval3, interval4);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 3.1: Intervalo B totalmente contido no intervalo A
    it('should return two intervals when intervalB is fully contained within intervalA', () => {
      const interval5 = { start: 0, end: 10 };
      const interval6 = { start: 2, end: 8 };
      const expectedResult = [
        { start: 0, end: 1 },
        { start: 9, end: 10 }
      ];
  
      const result = difference(interval5, interval6);
  
      expect(result).toEqual(expectedResult);
    });

    // Caso 3.2: A-B: Intervalo B partially overlaps intervalo A
    it('should return one interval when intervals partially overlaps', () => {
      const interval5 = { start: 0, end: 10 };
      const interval6 = { start: 5, end: 15 };
      const expectedResult = [
        { start: 0, end: 4 },
      ];
  
      const result = difference(interval5, interval6);
  
      expect(result).toEqual(expectedResult);
    });

    // Caso 3.2: B-A: Intervalo B partially overlaps intervalo A
    it('should return one interval when intervals partially overlaps', () => {
      const interval5 = { start: 0, end: 10 };
      const interval6 = { start: 5, end: 15 };
      const expectedResult = [
        { start: 11, end: 15 },
      ];
  
      const result = difference(interval6, interval5);
  
      expect(result).toEqual(expectedResult);
    });
  
});

describe.skip('split', () => {
    // Caso 1: Intervalos não se sobrepõem
    it('should return both intervals when they do not overlap', () => {
      const interval1 = { start: 1, end: 3 };
      const interval2 = { start: 5, end: 7 };
      const expectedResult: Interval[] = [interval1, interval2];
  
      const result = split(interval1, interval2);
  
      expect(result).toEqual(expectedResult);
    });

    // Caso 2: Intervalos se sobrepõem parcialmente
    it('should return 3 intervals (A-B, A^B, B-A) when the intervals partially overlap', () => {
      const interval3 = { start: 1, end: 5 };
      const interval4 = { start: 3, end: 7 };
      const expectedResult = [{ start: 1, end: 2 }, { start: 3, end: 5 }, { start: 6, end: 7 }];

      const result = split(interval3, interval4);

      expect(result).toEqual(expectedResult);
    });
})