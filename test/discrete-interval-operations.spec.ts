import { Interval, union, intersection, difference, split, flatten } from '../src/resource/utils/discrete-interval-operations'

describe('union', () => {
  // Caso 1: Intervalos não se sobrepõem
  it('should return both intervals when they do not overlap', () => {
    const intervalA = { start: 1, end: 3 };
    const intervalB = { start: 5, end: 7 };
    const expectedResult = [intervalA, intervalB];

    const result = union(intervalA, intervalB);

    expect(result).toHaveLength(expectedResult.length);
    for(const expected of expectedResult) {
      expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
    }
  });

  // Caso 2: Intervalos se sobrepõem parcialmente
  it('should return the merged interval when the intervals partially overlap', () => {
    const intervalA = { start: 1, end: 5 };
    const intervalB = { start: 3, end: 7 };
    const expectedResult = [{ start: 1, end: 7 }];

    const result = union(intervalA, intervalB);

    expect(result).toHaveLength(expectedResult.length);
    for(const expected of expectedResult) {
      expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
    }
  });

  // Caso 3: Intervalos são iguais
  it('should return one interval when the intervals are equal', () => {
    const intervalA = { start: 0, end: 10 };
    const intervalB = { start: 0, end: 10 };
    const expectedResult = [intervalA];

    const result = union(intervalA, intervalB);

    expect(result).toHaveLength(expectedResult.length);
    for(const expected of expectedResult) {
      expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
    }
  });

  // Caso 4: Um intervalo está totalmente contido no outro
  it('should return the larger interval when one interval is completely contained within the other', () => {
    const intervalA = { start: 2, end: 8 };
    const intervalB = { start: 3, end: 7 };
    const expectedResult = [{ start: 2, end: 8 }];

    const result = union(intervalA, intervalB);

    expect(result).toHaveLength(expectedResult.length);
    for(const expected of expectedResult) {
      expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
    }
  });

  // Caso 5: Intervalos não se sobrepõem e um começa após o outro
  it('should return one intervals when they do not overlap and one starts after the other', () => {
    const intervalA = { start: 1, end: 3 };
    const intervalB = { start: 4, end: 6 };
    const expectedResult = [{ start: 1, end: 6 }];

    const result1 = union(intervalA, intervalB);
    expect(result1).toHaveLength(expectedResult.length);
    for(const expected of expectedResult) {
      expect(result1.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
    }

    const result2 = union(intervalB, intervalA);
    expect(result2).toHaveLength(expectedResult.length);
    for(const expected of expectedResult) {
      expect(result2.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
    }
  });
});

describe('intersection', () => {
    // Caso 1: Intervalos não se sobrepõem
    it('should return empty when the intervals do not overlap', () => {
      const intervalA = { start: 1, end: 3 };
      const intervalB = { start: 5, end: 7 };
      const expectedResult: Interval[] = [];
  
      const result = intersection(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
  
    // Caso 2: Intervalos se sobrepõem parcialmente
    it('should return the intersection interval when the intervals partially overlap', () => {
      const intervalA = { start: 1, end: 5 };
      const intervalB = { start: 3, end: 7 };
      const expectedResult = [{ start: 3, end: 5 }];
  
      const result = intersection(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
  
    // Caso 3: Intervalos são iguais
    it('should return the interval itself when the intervals are equal', () => {
      const intervalA = { start: 0, end: 10 };
      const intervalB = { start: 0, end: 10 };
      const expectedResult = [{ start: 0, end: 10 }];
  
      const result = intersection(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
  
    // Caso 4: Um intervalo está totalmente contido no outro
    it('should return the smaller interval when one interval is completely contained within the other', () => {
      const intervalA = { start: 2, end: 8 };
      const intervalB = { start: 3, end: 7 };
      const expectedResult = [{ start: 3, end: 7 }];
  
      const result = intersection(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
  
    // Caso 5: Intervalos não se sobrepõem e um começa após o outro
    it('should return empty when the intervals do not overlap and one starts after the other', () => {
      const intervalA = { start: 1, end: 3 };
      const intervalB = { start: 4, end: 6 };
      const expectedResult: Interval[] = [];
  
      const result = intersection(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
});

describe('difference', () => {
    // Caso 1: Intervalos não se sobrepõem
    it('should return intervalA when the intervals do not overlap', () => {
      const intervalA = { start: 1, end: 3 };
      const intervalB = { start: 5, end: 7 };
      const expectedResult = [intervalA];
  
      const result = difference(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
  
    // Caso 2: Intervalo A totalmente contido no intervalo B
    it('should return empty when intervalA is fully contained within intervalB', () => {
      const intervalA = { start: 1, end: 5 };
      const intervalB = { start: 0, end: 10 };
      const expectedResult: Interval[] = [];
  
      const result = difference(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
  
    // Caso 3.1: Intervalo B totalmente contido no intervalo A
    it('should return two intervals when intervalB is fully contained within intervalA', () => {
      const intervalA = { start: 0, end: 10 };
      const intervalB = { start: 2, end: 8 };
      const expectedResult = [
        { start: 0, end: 1 },
        { start: 9, end: 10 }
      ];
  
      const result = difference(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });

    // Caso 3.2: A-B: Intervalo B partially overlaps intervalo A
    it('should return one interval when intervals partially overlaps', () => {
      const intervalA = { start: 0, end: 10 };
      const intervalB = { start: 5, end: 15 };
      const expectedResult = [
        { start: 0, end: 4 },
      ];
  
      const result = difference(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });

    // Caso 3.2: B-A: Intervalo B partially overlaps intervalo A
    it('should return one interval when intervals partially overlaps', () => {
      const intervalA = { start: 0, end: 10 };
      const intervalB = { start: 5, end: 15 };
      const expectedResult = [
        { start: 11, end: 15 },
      ];
  
      const result = difference(intervalB, intervalA);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
  
});

describe('split', () => {
    // Caso 1: Intervalos não se sobrepõem
    it('should return both intervals when they do not overlap', () => {
      const intervalA = { start: 1, end: 3 };
      const intervalB = { start: 5, end: 7 };
      const expectedResult: Interval[] = [intervalA, intervalB];
  
      const result = split(intervalA, intervalB);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });

    // Caso 2: Intervalos se sobrepõem parcialmente
    it('should return 3 intervals (A-B, A^B, B-A) when the intervals partially overlap', () => {
      const intervalA = { start: 1, end: 5 };
      const intervalB = { start: 3, end: 7 };
      const expectedResult = [{ start: 1, end: 2 }, { start: 3, end: 5 }, { start: 6, end: 7 }];

      const result = split(intervalA, intervalB);

      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });

    // Caso 3: Intervalos são iguais
    it('should return one interval when the intervals are equal', () => {
      const intervalA = { start: 0, end: 10 };
      const intervalB = { start: 0, end: 10 };
      const expectedResult = [intervalA];

      const result = split(intervalA, intervalB);

      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });

    // Caso 4: Um intervalo está totalmente contido no outro
    it('should return 2 intervals (A-B, B) when one interval is completely contained within the other', () => {
      const intervalA = { start: 2, end: 8 };
      const intervalB = { start: 3, end: 6 };
      const expectedResult = [{ start: 2, end: 2 }, { start: 7, end: 8 }, { start: 3, end: 6 }];

      const result = split(intervalA, intervalB);

      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });

    // Caso 5: Intervalos não se sobrepõem e um começa após o outro
    it('should return both intervals when they do not overlap and one starts after the other', () => {
      const intervalA = { start: 1, end: 3 };
      const intervalB = { start: 4, end: 6 };
      const expectedResult = [intervalA, intervalB];

      const result = split(intervalA, intervalB);

      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    });
})

describe('flatten', () => {

  describe('C starts before A',() => {

    it('C ends before A (no overlaping)', () => {
      const intervalC = { start: 1, end: 3 };
      const intervalA = { start: 4, end: 7 };
      const expectedResult: Interval[] = [{ start: 1, end: 3 }, { start: 4, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C end equal to A start (no overlaping)', () => {
      const intervalC = { start: 1, end: 4 };
      const intervalA = { start: 4, end: 7 };
      const expectedResult: Interval[] = [{ start: 1, end: 4 }, { start: 4, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C ends inside A (partial overlaping)', () => {
      const intervalC = { start: 1, end: 5 };
      const intervalA = { start: 3, end: 7 };
      const expectedResult: Interval[] = [{ start: 1, end: 3 }, { start: 3, end: 5 }, { start: 5, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C end equal to A end (A inside C)', () => {
      const intervalC = { start: 1, end: 7 };
      const intervalA = { start: 3, end: 7 };
      const expectedResult: Interval[] = [{ start: 1, end: 3 }, { start: 3, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C ends after A (A in the middle of C)', () => {
      const intervalC = { start: 1, end: 7 };
      const intervalA = { start: 3, end: 5 };
      const expectedResult: Interval[] = [{ start: 1, end: 3 }, { start: 3, end: 5 }, { start: 5, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

  })

  describe('C start equal A start', () => {
    it('C ends equal A start (small overlaping)', () => {
      const intervalC = { start: 1, end: 2 };
      const intervalA = { start: 1, end: 7 };
      const expectedResult: Interval[] = [{ start: 1, end: 2 }, { start: 2, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C ends inside A (C inside A)', () => {
      const intervalC = { start: 1, end: 4 };
      const intervalA = { start: 1, end: 7 };
      const expectedResult: Interval[] = [{ start: 1, end: 4 }, { start: 4, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C end equal A end (both are equal)', () => {
      const intervalC = { start: 1, end: 7 };
      const intervalA = { start: 1, end: 7 };
      const expectedResult: Interval[] = [{ start: 1, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C end after A end (overlapping)', () => {
      const intervalC = { start: 1, end: 7 };
      const intervalA = { start: 1, end: 4 };
      const expectedResult: Interval[] = [{ start: 1, end: 4 }, { start: 4, end: 7 }];
  
      const result = flatten([intervalA], intervalC);
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

  })

  describe('C starts inside A', () => {
    it('C ends inside A (C is subset of A)', () => {
      const intervalC = { start: 4, end: 7 };
      const intervalA = { start: 2, end: 9 };
      const expectedResult: Interval[] = [{ start: 2, end: 4 }, { start: 4, end: 7 }, { start: 7, end: 9 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C end equal A end (C is subset of A)', () => {
      const intervalC = { start: 4, end: 9 };
      const intervalA = { start: 2, end: 9 };
      const expectedResult: Interval[] = [{ start: 2, end: 4 }, { start: 4, end: 9 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

    it('C end after A end (overlapping)', () => {
      const intervalC = { start: 4, end: 9 };
      const intervalA = { start: 2, end: 7 };
      const expectedResult: Interval[] = [{ start: 2, end: 4 }, { start: 4, end: 7 }, { start: 7, end: 9 }];
  
      const result = flatten([intervalA], intervalC);
  
      expect(result).toHaveLength(expectedResult.length);
      for(const expected of expectedResult) {
        expect(result.find(i => i.start == expected.start && i.end == expected.end)).toBeTruthy()
      }
    })

  })

})