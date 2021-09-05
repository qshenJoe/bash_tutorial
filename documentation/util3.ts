import { Util } from '@antv/g6';
// import { getLast } from '@opi/util';
const globalFontSize = 12;
const maxCableInfoWidth = 1000; // 119.2 - 16 * 2;
const ratio = 1; // 0.75;
export const partition = (arr: any[], length: number) => {
  const result = [];
  for (let i = 0, j = arr.length; i < j; i++) {
    if (i % length === 0) {
      result.push([]);
    }
    result[result.length - 1].push(arr[i]);
  }
  return result;
};

export const getMaxWidth = (items: number[]): number => {
  return Math.max(...items) <= 200 ? 200 : Math.max(...items) + 5;
};

export const calculateTextWidth = (str: string, fontSize: number) => {
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters

  const width = (str ?? '').split('').reduce((prev: number, curr: string) => {
    if (pattern.test(curr)) {
      prev += fontSize;
    } else {
      prev += Util.getLetterWidth(curr, fontSize);
    }
    return prev;
  }, 0);
  return width * ratio;
  // console.log(width);
};

export const fittingString = (str, maxWidth, fontSize) => {
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) {
      return;
    }
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      res = `${str.substr(0, i)}\n${fittingString(
        str.substr(i),
        maxWidth,
        fontSize
      )}`;
    }
  });
  return res;
};

export const transformData = (
  width: number,
  data: any[]
): { nodes: any[]; edges: any[] } => {
  const relationMap = new Map<number, number>();
  const devices = data.filter((_) => _.entityType === 'device'); // 0, 2, 4, 6, 8, 10
  const cables = data.filter((_) =>
    ['cable', 'cable_core'].includes(_.entityType)
  ); // 1,3,5,7,9,11
  if (
    devices.length !== 0 &&
    cables.length !== 0 &&
    devices.length === cables.length
  ) {
    devices.push({
      id: cables[cables.length - 1]?.pid,
      pid: 9999,
      entityName: 'Remote End',
      entityType: 'device',
      fromPort: 'Hole 01',
      toPort: 'Hole 02',
      location: 'NULL',
      container: null,
      modelId: null,
      typeName: null,
      color: null,
      length: null,
      lengthUnit: null,
      hide: true,
    });
  }
  const nodes = devices.map((device: any) => {
    const {
      id,
      pid,
      entityName,
      fromPort,
      toPort,
      location,
      container,
      modelId,
      typeId,
      typeName,
      color,
      length,
      hide,
    } = device;
    const labels = [location, container, typeName, fromPort, toPort];
    const widths = labels.map((_) => calculateTextWidth(_, globalFontSize));
    // console.log('WIDTH: ', getMaxWidth(widths));
    const total = labels.reduce((prev: string, curr: string) => {
      prev += `\n${calculateTextWidth(curr, globalFontSize)}`;
      return prev;
    }, '');
    // console.log('Label Width: ', total);
    const t: any = {
      id: `node${id}`,
      sid: id,
      pid,
      location,
      container,
      deviceName: entityName,
      sPort: fromPort,
      dPort: toPort,
      deviceType: typeName,
      typeId,
      hide,
      nodeBaseWidth: getMaxWidth(widths),
    };
    const ap = [];
    if (fromPort) {
      ap.push([0, 5 / 6]);
    }
    if (toPort) {
      ap.push([1, 5 / 6]);
    }
    t.anchorPoints = ap;
    return t;
  });

  nodes.forEach((node) => {
    const { sid, pid } = node;
    relationMap.set(pid, sid);
    relationMap.set(sid, sid);
  });
  const edges = cables
    .map((cable: any) => {
      const {
        id,
        pid,
        entityName,
        entityType,
        typeName,
        color,
        length,
        lengthUnit,
      } = cable;
      const source = relationMap.get(id);
      const target = relationMap.get(pid);
      if (target == null) {
        return null;
      }
      const cableName =
        entityName == null
          ? ''
          : fittingString(entityName ?? '', maxCableInfoWidth, globalFontSize) +
            '\n';
      const cableTypeName =
        typeName == null
          ? ''
          : fittingString(
              `Type: ${typeName}` ?? '',
              maxCableInfoWidth,
              globalFontSize
            ) + '\n';
      const cableLength = length == null ? '' : `${length}`;
      calculateTextWidth(cableName, globalFontSize);
      calculateTextWidth(cableTypeName, globalFontSize);
      const t: any = {
        source: `node${source}`,
        target: target ? `node${target}` : void 0,
        label: `${cableName}${cableTypeName}Len(${lengthUnit}): ${cableLength}`,
        cableColor: color,
        labelCfg: {
          refY: 50,
          style: {
            background: {
              fill: '#dfdfdf',
              stroke: '#fff',
              padding: [3, 2, 3, 2],
            },
          },
        },
        cableType: entityType === 'cable_core' ? 'R' : 'V',
      };
      return t;
    })
    .filter((_) => !!_);
  edges.forEach((edge: any, index: number) => {
    const isCorner = (index + 1) % 5 === 0;
    const isRDL = ((index + 1) / 5) % 2 === 1;
    const inOddRow = Math.floor(index / 5) % 2 === 1;
    if (isCorner) {
      edge.direction = isRDL ? 'RDL' : 'LDR';
      edge.sourceAnchor = isRDL ? 1 : 0;
      edge.targetAnchor = isRDL ? 1 : 0;
    } else {
      edge.sourceAnchor = inOddRow ? 0 : 1;
      edge.targetAnchor = inOddRow ? 1 : 0;
    }
    if (inOddRow && !isCorner) {
      edge.odd = true;
    }
  });

  console.log(edges);

  const tNodes = calculateNodeRows({ width }, nodes, 2).sort(
    (a, b) => a.sid - b.sid
  );
  tNodes.forEach((node: any, index: number) => {
    const evenRow = node.rowNum % 2 === 0;
    const position = node.position;
    if (edges[index]) {
      if (position) {
        edges[index].sourceAnchor = position === 'L' ? 1 : 0;
        edges[index].targetAnchor = position === 'L' ? 1 : 0;
      } else {
        edges[index].sourceAnchor = evenRow ? 1 : 0;
        edges[index].targetAnchor = evenRow ? 0 : 1;
      }
    }
  });
  return {
    nodes: tNodes,
    edges,
  };
};

/**
 * Calculation for layout
 */

export const calculateNodeRows = (
  config: any,
  nodes: any[],
  type: 1 | 2 = 1
): any[][] | any[] | any => {
  const { width, cableBaseWidth, margin } = config;
  const maxWidth = 2 * width;
  const baseMargin = 200;
  const baseCableWidth = 180;
  const resultRows = [];
  let currentRow = [];
  nodes.forEach((node: any, index: number, arr: any[]) => {
    if (
      nodeFitRow([...currentRow, node], baseMargin, maxWidth, baseCableWidth)
    ) {
      if (resultRows.length % 2 === 0) {
        currentRow.push(node);
      } else {
        currentRow.unshift(node);
      }
      if (index === arr.length - 1) {
        resultRows.push([...currentRow]);
      }
    } else {
      resultRows.push([...currentRow]);
      currentRow = [];
      currentRow.push(node);
      if (index === arr.length - 1) {
        resultRows.push([...currentRow]);
      }
    }
  });
  resultRows.forEach((row: any[], index: number, _arr: any[]) => {
    row.forEach((node: any, idx: number, arr: any[]) => {
      node.rowNum = index;
      if (idx === 0 && index % 2 !== 0) {
        node.position = 'F';
      }
      if (idx === arr.length - 1 && index % 2 === 0) {
        node.position = 'L';
      }
    });
  });
  console.log('result rows', resultRows);
  const dataNodes = resultRows.reduce((prev, curr) => {
    prev = prev.concat(...curr);
    return prev;
  }, []);
  return type === 1 ? resultRows : dataNodes;
};

export const nodeFitRow = (
  row: any[],
  margin: number,
  maxWidth: number,
  cableBaseWidth: number
) => {
  const totalWidth =
    sum(row, 'nodeBaseWidth') + 2 * margin + row.length * cableBaseWidth;
  return totalWidth < maxWidth;
};

export const sum = (arr: any[], key: string) =>
  arr.reduce((prev: number, curr: any) => {
    if (curr[key]) {
      prev += curr[key];
    }
    return prev;
  }, 0);
