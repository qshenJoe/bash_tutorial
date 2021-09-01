import { registerLayout } from '@antv/g6';
import { partition } from '../utils';

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
      const nodeSep = self.nodeSep || 300;
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
        rowPositions.push({
          x: beginX,
          y: beginY + nodeSep * index,
        });
      });
      rows.forEach((row: any[], index: number) => {
        row.forEach((node: any, idx: number) => {
          if (index % 2 === 0) {
            node.x = rowPositions[index].x + idx * nodeSep;
            node.y = rowPositions[index].y; // + index * nodeSep;
          } else {
            node.x = rowPositions[index].x + (4 - idx) * nodeSep;
            node.y = rowPositions[index].y; // + index * nodeSep;
          }
          console.log('Node.x', node);
        });
      });
      console.log('', rows);
      console.log(rowPositions);
    },
  });
