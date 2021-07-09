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
    circuitIdx: 6,
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
  const {
    quantity,
    circuits,
    numOfPhase,
    startIndex,
    rowMode,
    numberType,
  } = config;
  if (rowMode === ROW_MODE.SINGLE) {
    /**
     * [Step 1] initialize middle data
     */
    for (let i = 0; i < circuits; i++) {
      mid_data.push({
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

    /**
     * [Step 2] fill in middle data with used breakers
     * ! assuming input data is always valid
     */
    placeUsedBreaker(input, mid_data);
    console.log('mid', mid_data);

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
    console.log('mid 2', mid_data);

    checkConflict(mid_data);
    return {
      code: 1,
      data: mid_data,
    };
  } else if (rowMode === ROW_MODE.DOUBLE) {
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

const placeUsedBreaker = (input: any[], mid: any[]) => {
  input.forEach(b => {
    const { circuitIdx, numOfPhase } = b;
    for (let i = circuitIdx; i < circuitIdx + numOfPhase; i++) {
      if (mid[i - 1]) {
        mid[i - 1]['leftUsed'] = true;
      }
    }
  });
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
