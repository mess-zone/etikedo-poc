import { Interval, union, intersection, difference } from '../src/resource/utils/interval-operations'

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
    it('should return null when the intervals do not overlap', () => {
      const interval1 = { start: 1, end: 3 };
      const interval2 = { start: 5, end: 7 };
      const expectedResult: Interval = null;
  
      const result = intersection(interval1, interval2);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 2: Intervalos se sobrepõem parcialmente
    it('should return the intersection interval when the intervals partially overlap', () => {
      const interval3 = { start: 1, end: 5 };
      const interval4 = { start: 3, end: 7 };
      const expectedResult = { start: 3, end: 5 };
  
      const result = intersection(interval3, interval4);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 3: Intervalos são iguais
    it('should return the interval itself when the intervals are equal', () => {
      const interval5 = { start: 0, end: 10 };
      const interval6 = { start: 0, end: 10 };
      const expectedResult = { start: 0, end: 10 };
  
      const result = intersection(interval5, interval6);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 4: Um intervalo está totalmente contido no outro
    it('should return the smaller interval when one interval is completely contained within the other', () => {
      const interval7 = { start: 2, end: 8 };
      const interval8 = { start: 3, end: 7 };
      const expectedResult = { start: 3, end: 7 };
  
      const result = intersection(interval7, interval8);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 5: Intervalos não se sobrepõem e um começa após o outro
    it('should return null when the intervals do not overlap and one starts after the other', () => {
      const interval9 = { start: 1, end: 3 };
      const interval10 = { start: 4, end: 6 };
      const expectedResult: Interval = null;
  
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
    it('should return intervalA when intervalA is fully contained within intervalB', () => {
      const interval3 = { start: 1, end: 5 };
      const interval4 = { start: 0, end: 10 };
      const expectedResult: Interval[] = [];
  
      const result = difference(interval3, interval4);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 3: Intervalo B totalmente contido no intervalo A
    it('should return two intervals when intervalB is fully contained within intervalA', () => {
      const interval5 = { start: 0, end: 10 };
      const interval6 = { start: 2, end: 8 };
      const expectedResult = [
        { start: 0, end: 2 },
        { start: 8, end: 10 }
      ];
  
      const result = difference(interval5, interval6);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 4: Intervalo B à esquerda do intervalo A
    it('should return intervalA when intervalB is to the left of intervalA', () => {
      const interval7 = { start: 5, end: 10 };
      const interval8 = { start: 2, end: 4 };
      const expectedResult = [interval7];
  
      const result = difference(interval7, interval8);
  
      expect(result).toEqual(expectedResult);
    });
  
    // Caso 5: Intervalo B à direita do intervalo A
    it('should return intervalA when intervalB is to the right of intervalA', () => {
      const interval9 = { start: 5, end: 10 };
      const interval10 = { start: 12, end: 15 };
      const expectedResult = [interval9];
  
      const result = difference(interval9, interval10);
  
      expect(result).toEqual(expectedResult);
    });
  });