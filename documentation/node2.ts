// import G6 from '@antv/g6';
import { registerLayout } from '@antv/g6';
const partition = (arr: any[], length: number) => {
  const result = [];
  for (let i = 0, j = arr.length; i < j; i++) {
    if (i % length === 0) {
      result.push([]);
    }
    result[result.length - 1].push(arr[i]);
  }
  return result;
};
export const registerCustomLayout = () =>
  registerLayout('d13n-layout', {
    getDefaultCfg: function getDefaultCfg() {
      return {
        center: [0, 0],
        lineSep: 100,
        nodeSep: 50,
        nodeSide: 100,
      };
    },
    execute: function execute() {
      const self = this;
      const center = self.center || [0, 0];
      const nodeSep = self.nodeSep || 250;
      const nodeSize = self.nodeSize || 100;
      const marginX = self.marginX || 100;
      const marginY = self.marginY || 100;
      console.log('Container Width', self.width);
      const { nodes, edges } = self;
      // console.log(nodes);
      // console.log(edges);
      const rows = partition(nodes, 5);
      console.log(rows);
      const beginX = center[0] + marginX;
      const beginY = center[1] + marginY;
      const rowPositions = [];
      rows.forEach((row: any[], index: number) => {
        // if index is odd, reverse position x
        if (index % 2 === 0) {
          rowPositions.push({
            x: beginX + (nodeSep * index) / 2,
            y: beginY + (nodeSep * index) / 2,
          });
        } else {
          rowPositions.push({
            x: beginX + (nodeSep * (index + 1)) / 2,
            y: beginY + (nodeSep * (index + 1)) / 2,
          });
        }
      });
      rows.forEach((row: any[], index: number) => {
        row.forEach((node: any, idx: number) => {
          node.x = rowPositions[index].x + idx * nodeSep;
          node.y = rowPositions[index].y + index * nodeSep;
          console.log('Node.x', node);
        });
      });
      console.log(rowPositions);
    },
  });
