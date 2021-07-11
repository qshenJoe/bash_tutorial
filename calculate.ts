const WHITE = '#ffffff';
const NEW_BREAKER = '#6ED478';
const USED_BREAKER = '#F2F2F2';
const CONFLICT = '#ff0303';

export interface OutputModel {
  idx1: number;
  idx2: number;
  phase: string;
  leftUsed: boolean;
  leftIsNew: boolean;
  rightUsed: boolean;
  rightIsNew: boolean;
  leftConflict?: boolean;
  rightConflict?: boolean;
}

export interface InputModel {
  circuitIdx: number;
  numOfPhase: number;
}

const INPUT_DOUBLE_135 = [
  {
    circuitIdx: 1,
    numOfPhase: 3,
  },
  {
    circuitIdx: 2,
    numOfPhase: 2,
  },
  {
    circuitIdx: 16,
    numOfPhase: 1,
  },
  {
    circuitIdx: 8,
    numOfPhase: 3,
  },
  {
    circuitIdx: 13,
    numOfPhase: 3,
  },
];

const INPUT_DOUBLE_123 = [
  {
    circuitIdx: 1,
    numOfPhase: 3,
  },
  {
    circuitIdx: 4,
    numOfPhase: 3,
  },
  {
    circuitIdx: 55,
    numOfPhase: 3,
  },
];

const INPUT_SINGLE = [
  {
    circuitIdx: 1,
    numOfPhase: 3,
  },
  {
    circuitIdx: 5,
    numOfPhase: 3,
  },
];

export const INPUT_SOURCE = {
  INPUT_SINGLE: INPUT_SINGLE,
  INPUT_DOUBLE_135: INPUT_DOUBLE_135,
  INPUT_DOUBLE_123: INPUT_DOUBLE_123,
};

const ROW_MODE = {
  SINGLE: 1,
  DOUBLE: 0,
};
const NUMBER_TYPE = {
  HORI: 0, // 1,3,5
  VERT: 1, // 1,2,3
};

const NEW_BREAKER_CONFIG = {
  QUANTITY: 1,
  CIRCUITS: 95,
  NUM_OF_PHASE: 3,
  START_INDEX: 14,
  ROW_MODE: ROW_MODE.SINGLE,
  NUMBER_TYPE: NUMBER_TYPE.VERT,
};

export const getPreviewData = (
  input: InputModel[],
  config: any
): {
  code: 1 | 3 | number;
  data: OutputModel[];
} => {
  const code = 1;
  const mid_data = [];
  const { quantity, circuits, numOfPhase, startIndex, rowMode, numberType } =
    config;
  if (rowMode === ROW_MODE.SINGLE) {
    /**
     * [Step 1] initialize middle data
     */
    initData(mid_data, circuits, rowMode);
    console.log('[MID after Step 1]', mid_data);

    /**
     * [Step 2] fill in middle data with used breakers
     * ! assuming input data is always valid
     */
    placeUsedBreaker(input, mid_data, circuits, rowMode);
    console.log('[MID after Step 2]', mid_data);

    /**
     * [Step 3] fill in middle data with new breakers
     */
    placeNewBreakerForSingle(
      {
        quantity,
        circuits,
        numOfPhase,
        startIndex,
      },
      mid_data
    );
    console.log('[MID after Step 3]', mid_data);

    checkConflict(mid_data);
    return {
      code: 1,
      data: mid_data,
    };
  } else if (rowMode === ROW_MODE.DOUBLE) {
    if (numberType === NUMBER_TYPE.VERT) {
      // step 1
      initData(mid_data, circuits, rowMode);
      console.log('[MID after Step 1]', mid_data);

      // step 2
      placeUsedBreaker(input, mid_data, circuits, rowMode);
      console.log('[MID after Step 2]', mid_data);

      // step 3
      placeNewBreakerForDoubleVert(
        {
          quantity,
          circuits,
          numOfPhase,
          startIndex,
        },
        mid_data
      );
      console.log('[MID after Step 3]', mid_data);
      checkConflict(mid_data);
      return {
        code: 1,
        data: mid_data,
      };
    } else if (numberType === NUMBER_TYPE.HORI) {
      // step 1
      initData(mid_data, circuits, rowMode, NUMBER_TYPE.HORI);
      console.log('[MID after Step 1]', mid_data);

      // step 2
      placeUsedBreaker(input, mid_data, circuits, rowMode, NUMBER_TYPE.HORI);
      console.log('[MID after Step 2]', mid_data);

      // step 3
      placeNewBreakerForDoubleHori(
        {
          quantity,
          circuits,
          numOfPhase,
          startIndex,
        },
        mid_data
      );
      console.log('[MID after Step 3]', mid_data);
      checkConflict(mid_data);
      return {
        code: 1,
        data: mid_data,
      };
    }
  }
  return {
    code,
    data: [],
  };
};

/**
 * ==================================================
 * HELPER FUNCTIONS
 * ==================================================
 */

const getPhaseByIndex = (index: number): string => {
  const val = index % 3;
  switch (val) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    default:
      return 'A';
  }
};

const initData = (
  mid: any[],
  circuits: number,
  rowMode: number,
  numberType = 1
) => {
  if (rowMode === ROW_MODE.SINGLE) {
    for (let i = 0; i < circuits; i++) {
      mid.push({
        idx1: i + 1,
        phase: getPhaseByIndex(i),
        leftIsNew: false,
        leftUsed: false,
        rightUsed: false,
        rightIsNew: false,
        leftConflict: false,
        rightConflict: false,
      });
    }
  } else {
    const leftMax = circuits % 2 === 0 ? circuits / 2 : (circuits + 1) / 2;
    if (numberType === NUMBER_TYPE.VERT) {
      for (let i = 0; i < leftMax; i++) {
        mid.push({
          idx1: i + 1,
          idx2: removeLastIndex(i + 1 + leftMax, circuits),
          phase: getPhaseByIndex(i),
          leftIsNew: false,
          leftUsed: false,
          rightUsed: false,
          rightIsNew: false,
          leftConflict: false,
          rightConflict: false,
        });
      }
    } else if (numberType === NUMBER_TYPE.HORI) {
      for (let i = 0; i < leftMax; i++) {
        mid.push({
          idx1: i * 2 + 1,
          idx2: removeLastIndex(i * 2 + 2, circuits),
          phase: getPhaseByIndex(i),
          leftIsNew: false,
          leftUsed: false,
          rightUsed: false,
          rightIsNew: false,
          leftConflict: false,
          rightConflict: false,
        });
      }
    }
  }
};

const placeUsedBreaker = (
  input: any[],
  mid: any[],
  circuits: number,
  rowMode: number,
  numberType = NUMBER_TYPE.VERT
) => {
  const leftMax = circuits % 2 === 0 ? circuits / 2 : (circuits + 1) / 2;
  if (rowMode === ROW_MODE.SINGLE) {
    input.forEach((b) => {
      const { circuitIdx, numOfPhase } = b;
      for (let i = circuitIdx; i < circuitIdx + numOfPhase; i++) {
        if (mid[i - 1]) {
          mid[i - 1]['leftUsed'] = true;
        }
      }
    });
  } else {
    if (numberType === NUMBER_TYPE.VERT) {
      input.forEach((b) => {
        const { circuitIdx, numOfPhase } = b;
        for (let i = circuitIdx; i < circuitIdx + numOfPhase; i++) {
          if (i <= leftMax ? mid[i - 1] : mid[i - leftMax - 1]) {
            (i <= leftMax ? mid[i - 1] : mid[i - leftMax - 1])[
              i <= leftMax ? 'leftUsed' : 'rightUsed'
            ] = true;
          }
        }
      });
    } else if (numberType === NUMBER_TYPE.HORI) {
      input.forEach((b) => {
        const { circuitIdx, numOfPhase } = b;
        for (let i = circuitIdx; i < circuitIdx + numOfPhase * 2; i += 2) {
          if (i % 2 === 0 && mid[i / 2 - 1]) {
            mid[i / 2 - 1].rightUsed = true;
          } else if (i % 2 === 1 && mid[(i - 1) / 2]) {
            mid[(i - 1) / 2].leftUsed = true;
          }
        }
      });
    }
  }
};

const placeNewBreakerForSingle = (config: any, mid: any[]) => {
  const { quantity, circuits, numOfPhase, startIndex } = config;
  const actualIndex = startIndex - 1;
  const total = numOfPhase * quantity;
  for (let i = actualIndex; i < actualIndex + total; i++) {
    if (i >= circuits) {
      break;
    }
    mid[i].leftIsNew = true;
  }
};

const placeNewBreakerForDoubleVert = (config: any, mid: any[]) => {
  const { quantity, circuits, numOfPhase, startIndex } = config;
  const leftMax = circuits % 2 === 0 ? circuits / 2 : (circuits + 1) / 2;
  const actualIndex = startIndex - 1;
  const total = numOfPhase * quantity;
  for (let i = actualIndex; i < actualIndex + total; i++) {
    if (i >= circuits) {
      break;
    }
    if (i < leftMax) {
      mid[i].leftIsNew = true;
      // check case: breaker cross two rows
    } else {
      mid[i - leftMax].rightIsNew = true;
    }
  }
};

const placeNewBreakerForDoubleHori = (config: any, mid: any[]) => {
  const { quantity, circuits, numOfPhase, startIndex } = config;
  const leftMax = circuits % 2 === 0 ? circuits / 2 : (circuits + 1) / 2;
  const actualIndex = (startIndex - 1) / 2;
  // const total = numOfPhase * quantity;
  let currIndex = actualIndex;
  for (let i = 0; i < quantity; i++) {
    if (currIndex + numOfPhase > circuits) {
      break;
    }
    if (currIndex % 2 === 0) {
      for (let j = currIndex; j < currIndex + numOfPhase * 2; j += 2) {
        mid[j / 2 - 1].rightIsNew = true;
      }
      currIndex += numOfPhase * 2;
    } else if (currIndex % 2 === 1) {
      for (let j = currIndex; j < currIndex + numOfPhase * 2; j += 2) {
        mid[(j - 1) / 2].leftIsNew = true;
      }
      currIndex += numOfPhase * 2;
    }
  }
};

const checkConflict = (input: any[]) => {
  input.forEach((_: any, index: number) => {
    const { leftUsed, leftIsNew, rightUsed, rightIsNew } = _;
    _['leftConflict'] = leftUsed && leftIsNew;
    _['rightConflict'] = rightUsed && rightIsNew;
  });
};

const formatRowData = (data: any) => {
  const {
    leftUsed,
    rightUsed,
    leftIsNew,
    rightIsNew,
    leftConflict,
    rightConflict,
  } = data;
  return {
    ...data,
    _idx1_background: getColorByType(leftUsed, leftIsNew, leftConflict),
    _idx2_background: getColorByType(rightUsed, rightIsNew, rightConflict),
  };
};

const getColorByType = (used: boolean, isNew: boolean, conflict: boolean) => {
  if (conflict) {
    return CONFLICT;
  }
  if (isNew) {
    return NEW_BREAKER;
  }
  if (used) {
    return USED_BREAKER;
  } else {
    return WHITE;
  }
};

const removeLastIndex = (input: number, max: number) => {
  return input > max ? null : input;
};
