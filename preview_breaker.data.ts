type Phase = 'A' | 'B' | 'C';
type PhaseNumber = 1 | 2 | 3;
type Vacant = 'E';
type RowMode = 'single' | 'double';
type AlignMode = 'horizontal' | 'vertical';
export interface PanelRow {
  idx: number;
  phase: Phase | Vacant;
}
interface BreakerItem {
  circuitIdx: number;
  numOfPhase: PhaseNumber;
}

interface SingleRowDataItem {
  id: number;
  phase: Phase;
  bgColor: string;
  circuitIdx: number;
}
const DEFAULT_CIRCUITS = 42;
const DEFAULT_NUMBER_OF_PHASE = 3;
const getPhase = (diff: number): Phase | Vacant => {
  switch (diff) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    default:
      return 'E';
  }
};
const getHorizontalPhase = (diff: number): Phase | Vacant => {
  switch (diff) {
    case 0:
      return 'A';
    case 2:
      return 'B';
    case 4:
      return 'C';
    default:
      return 'E';
  }
};

export const getIndexA = (
  circuits: number = DEFAULT_CIRCUITS,
  idx = DEFAULT_NUMBER_OF_PHASE
): PanelRow[] => {
  const arr = [];
  let endOfBreaker: boolean = false;
  let currentIndexA: number;
  let nextIndexA: number;
  for (let i = 1; i < circuits; i += idx) {
    currentIndexA = i;
    endOfBreaker = false;
    for (let j = i; j < i + idx; j++) {
      arr.push({ idx: j, phase: getPhase(j - i) });
    }
    endOfBreaker = true;
  }
  return arr;
};

/**
 * =============================================
 * HELPER FUNCTIONS
 * =============================================
 */

export const getFirstPanelLength = (circuits: number): number => {
  return circuits % 2 === 0 ? circuits / 2 : circuits / 2 + 1;
};

export const getStartIndex = (start: number): number => {
  return (start - 1) % 2 === 0 ? (start - 1) / 2 : start / 2;
};

export const getCheckIndex = (startIndex: number, base: number) => {
  if (startIndex % 2 === 0) {
    return startIndex / 2 + base - 1;
  } else {
    return startIndex / 2;
  }
};

/**
 * =============================================
 * GENERATE PANEL BREAKER PREVIEW DATA
 * =============================================
 */

/**
 * MOCK DATA SINGLE
 * 3-2-3-2-1-2-3
 */
export const mock_single_data: BreakerItem[] = [
  {
    circuitIdx: 1,
    numOfPhase: 3,
  },
  {
    circuitIdx: 4,
    numOfPhase: 2,
  },
  {
    circuitIdx: 6,
    numOfPhase: 3,
  },
  {
    circuitIdx: 9,
    numOfPhase: 1,
  },
  {
    circuitIdx: 11,
    numOfPhase: 3,
  },
];

/**
 * MOCK DATA DOUBLE - VERTICAL
 */
export const mock_double_vertical_data: BreakerItem[] = [
  {
    circuitIdx: 1,
    numOfPhase: 3,
  },
  {
    circuitIdx: 4,
    numOfPhase: 2,
  },
  {
    circuitIdx: 6,
    numOfPhase: 3,
  },
  {
    circuitIdx: 9,
    numOfPhase: 1,
  },
  {
    circuitIdx: 11,
    numOfPhase: 3,
  },
  {
    circuitIdx: 29,
    numOfPhase: 3,
  },
];

/**
 * MOCK DATA DOUBLE - HORIZONTAL
 */

export const mock_double_horizontal_data: BreakerItem[] = [
  {
    circuitIdx: 1,
    numOfPhase: 3,
  }, // 1, 3, 5
  {
    circuitIdx: 4,
    numOfPhase: 2,
  }, // 4, 6
  {
    circuitIdx: 7,
    numOfPhase: 3,
  }, // 7, 9, 11
  {
    circuitIdx: 8,
    numOfPhase: 1,
  }, // 8
  {
    circuitIdx: 12,
    numOfPhase: 3,
  }, // 12, 14, 16
  {
    circuitIdx: 29,
    numOfPhase: 3,
  }, // 29, 31, 33
];

export const getStandardData = (
  circuits: number = DEFAULT_CIRCUITS,
  rowMode: RowMode = 'single',
  mode: AlignMode = 'vertical',
  currB: BreakerItem[] = [],
  numOfPhase: PhaseNumber,
  count: number,
  startIndex: number
): PanelRow[][] | PanelRow[][][] => {
  let result: PanelRow[] = [];
  let finalResult: PanelRow[] = Array(circuits).fill({
    idx: 0,
    phase: 'E',
  });
  if (rowMode === 'single') {
    return getSingleRowData(
      circuits,
      currB,
      numOfPhase,
      count,
      startIndex,
      result,
      finalResult
    );
  } else if (rowMode === 'double') {
    if (mode === 'horizontal') {
      return getDoubleHorizontalData(
        circuits,
        currB,
        numOfPhase,
        count,
        startIndex,
        result,
        finalResult
      );
    } else if (mode === 'vertical') {
      return getDoubleVerticalData(
        circuits,
        currB,
        numOfPhase,
        count,
        startIndex,
        result,
        finalResult
      );
    }
  }
};

/**
 * if mode is double panel row and breakers are vertically placed,
 * check edge cases
 * 1 phase - can be placed anywhere
 * 2 phases - move to next idx if current idx is the last idx of first panel
 * 3 phases - move to next 2 idx if current idx is the last 2 idx of first panel
 */
const placeNewBreakers = (
  count: number,
  numOfPhase: PhaseNumber,
  curr: PanelRow[],
  length: number,
  startIndex: number, // 16 check
  mode: 'single' | 'double_vert' | 'double_hori'
) => {
  const lengthOfFirstPanel = getFirstPanelLength(length); // 42 -> 21
  let init = false;
  const fitPhase = (num: PhaseNumber, curr: PanelRow[], startIdx: number) => {
    let fit = true;
    if (mode === 'double_hori') {
      for (let i = startIdx; i < startIdx + num; i++) {
        // 28
        const nextIdx = i < length / 2 ? i + length / 2 : i - length / 2 + 1;
        const available =
          (curr[i] && curr[i].idx === 0) ||
          (curr[nextIdx] && curr[nextIdx].idx === 0);
        if (numOfPhase === 1) {
          fit = fit && available;
        } else if (numOfPhase === 2) {
          fit = fit && available && startIdx !== lengthOfFirstPanel - 1;
        } else if (numOfPhase === 3) {
          fit =
            fit &&
            available &&
            startIdx !== lengthOfFirstPanel - 1 &&
            startIdx !== lengthOfFirstPanel - 2;
        }
      }
    } else {
      for (let i = startIdx; i < startIdx + num; i++) {
        if (numOfPhase === 1) {
          fit = fit && curr[i] && curr[i].idx === 0;
        } else if (numOfPhase === 2) {
          fit =
            fit &&
            curr[i] &&
            curr[i].idx === 0 &&
            startIdx !== lengthOfFirstPanel - 1;
        } else if (numOfPhase === 3) {
          fit =
            fit &&
            curr[i] &&
            curr[i].idx === 0 &&
            startIdx !== lengthOfFirstPanel - 1 &&
            startIdx !== lengthOfFirstPanel - 2;
        }
      }
    }
    if (fit) {
      if (mode === 'double_hori') {
        // find the right start index is the key
        const nextIdx =
          curr[startIdx] && curr[startIdx].idx === 0
            ? startIdx
            : startIdx < length / 2
            ? startIdx + length / 2
            : startIdx - length / 2 + 1;
        for (let i = nextIdx; i < nextIdx + num; i++) {
          curr[i] = {
            idx: i < length / 2 ? i * 2 + 1 : (i - length / 2) * 2 + 2,
            phase: getPhase(i - nextIdx),
          };
        }
        init = true;
      } else {
        for (let i = startIdx; i < startIdx + num; i++) {
          curr[i] = { idx: i + 1, phase: getPhase(i - startIdx) };
        }
        init = true;
      }
    }
  };
  // const newBreaker: PanelRow[] = getNewBreaker(numOfPhase);
  for (let i = 0; i < count; i++) {
    init = false;
    if (mode === 'double_hori') {
      const checkIdx = getCheckIndex(startIndex, length / 2); // 28
      for (let j = checkIdx; j < length; j++) {
        if (!init) {
          fitPhase(numOfPhase, curr, j);
        }
      }
    } else {
      for (let j = startIndex - 1; j < length; j++) {
        if (!init) {
          fitPhase(numOfPhase, curr, j);
        }
      }
    }
  }
};

const getNewBreaker = (phase: PhaseNumber): PanelRow[] => {
  const result: PanelRow[] = [];
  for (let i = 0; i < phase; i++) {
    result.push({ idx: 0, phase: getPhase(i) });
  }
  return result;
};

const getSingleRowData = (
  circuits: number,
  currB: BreakerItem[],
  numOfPhase: PhaseNumber,
  count: number,
  startIndex: number,
  result: PanelRow[],
  finalResult: PanelRow[]
): PanelRow[][] => {
  currB.reduce((prev: PanelRow[], curr: BreakerItem) => {
    const { circuitIdx, numOfPhase } = curr;
    for (let i = circuitIdx; i < circuitIdx + numOfPhase; i++) {
      prev.push({ idx: i, phase: getPhase(i - circuitIdx) });
    }
    return prev;
  }, result);
  // merge current data
  for (let i = 0; i < result.length; i++) {
    if (result[i] != null) {
      const { idx } = result[i];
      finalResult[idx - 1] = result[i];
    }
  }
  const before = [...finalResult];
  placeNewBreakers(
    count,
    numOfPhase,
    finalResult,
    circuits,
    startIndex,
    'single'
  );
  const after = finalResult;
  return [before, after];
};

const getDoubleVerticalData = (
  circuits: number,
  currB: BreakerItem[],
  numOfPhase: PhaseNumber,
  count: number,
  startIndex: number,
  result: PanelRow[],
  finalResult: PanelRow[]
): PanelRow[][][] => {
  /**
   * If current breaker data is valid, then we can first convert it
   * to single row panel and split it into double row panel
   */
  currB.reduce((prev: PanelRow[], curr: BreakerItem) => {
    const { circuitIdx, numOfPhase } = curr;
    for (let i = circuitIdx; i < circuitIdx + numOfPhase; i++) {
      prev.push({ idx: i, phase: getPhase(i - circuitIdx) });
    }
    return prev;
  }, result);
  // merge current data
  for (let i = 0; i < result.length; i++) {
    if (result[i] != null) {
      const { idx } = result[i];
      finalResult[idx - 1] = result[i];
    }
  }
  const before = transformS2D([...finalResult], circuits);
  placeNewBreakers(
    count,
    numOfPhase,
    finalResult,
    circuits,
    startIndex,
    'double_vert'
  );
  const after = transformS2D([...finalResult], circuits);
  return [before, after];
};

const getDoubleHorizontalData = (
  circuits: number,
  currB: BreakerItem[],
  numOfPhase: PhaseNumber,
  count: number,
  startIndex: number,
  result: PanelRow[],
  finalResult: PanelRow[] | PanelRow[][]
): PanelRow[][][] => {
  // format finalResult
  finalResult = transformS2D([...(finalResult as PanelRow[])], circuits);
  /**
   * If current breaker data is valid, then we can first convert it
   * to single row panel and split it into double row panel
   */
  currB.reduce((prev: PanelRow[], curr: BreakerItem) => {
    const { circuitIdx, numOfPhase } = curr;
    for (let i = circuitIdx; i < circuitIdx + numOfPhase * 2; i += 2) {
      prev.push({ idx: i, phase: getHorizontalPhase(i - circuitIdx) });
    }
    return prev;
  }, result);
  console.log('middle result', result);
  // merge current data
  for (let i = 0; i < result.length; i++) {
    if (result[i] != null) {
      const { idx } = result[i];
      if (idx % 2 === 0) {
        finalResult[1][idx / 2 - 1] = result[i];
      } else {
        finalResult[0][(idx - 1) / 2] = result[i];
      }
    }
  }
  const before = finalResult; // transformS2D([...finalResult], circuits);
  console.log('middle before', finalResult);
  let midFinalResult = [...finalResult[0], ...finalResult[1]];
  console.log('Step 1: ', midFinalResult);
  placeNewBreakers(
    count,
    numOfPhase,
    midFinalResult,
    circuits,
    startIndex,
    'double_hori'
  );
  console.log('Step 2: ', midFinalResult);
  const after = transformS2D([...midFinalResult], circuits);
  return [before, after];
};

const transformS2D = (single: PanelRow[], circuits: number): PanelRow[][] => {
  const count = getFirstPanelLength(circuits);
  const origin = [...single];
  const row1st = origin.splice(0, count);
  const row2nd = origin;
  return [row1st, row2nd];
};
