import { union } from '../src/resource/utils/interval-operations'

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
