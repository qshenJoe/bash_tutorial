import { Util } from '@antv/g6';
const globalFontSize = 12;
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

export const transformData = (data: any[]): { nodes: any[]; edges: any[] } => {
  const relationMap = new Map<number, number>();
  const devices = data.filter(_ => _.entityType === 'device'); // 0, 2, 4, 6, 8, 10
  const cables = data.filter(_ => _.entityType === 'cable'); // 1,3,5,7,9,11
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
      typeName,
      color,
      length,
    } = device;
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
      modelId,
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
  nodes.forEach(node => {
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
          : fittingString(entityName ?? '', 80, globalFontSize) + '\n';
      const cableTypeName =
        typeName == null
          ? ''
          : fittingString(typeName ?? '', 80, globalFontSize) + '\n';
      const cableLength = length == null ? '' : `${length} ${lengthUnit}`;
      const t = {
        source: `node${source}`,
        target: target ? `node${target}` : void 0,
        label: `Name: ${cableName}Type: ${cableTypeName}Length: ${cableLength}`,
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
      };
      return t;
    })
    .filter(_ => !!_);
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

  return {
    nodes,
    edges,
  };
};
