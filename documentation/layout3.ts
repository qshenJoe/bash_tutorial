import { registerLayout } from '@antv/g6';
import { calculateNodeRows, partition } from '../utils';

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
      const pathWidth = self.cableBaseWidth;
      const center = self.center || [0, 0];
      const nodeSep = self.nodeSep || 400;
      const nodeSize = self.nodeSize || 200;
      const marginX = self.marginX || 100;
      const marginY = self.marginY || 100;
      const { nodes } = self;
      const rows = calculateNodeRows({ width: self.width }, nodes); // partition(nodes, 5);
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
      rows.forEach((row: any[], index: number, arr: any[]) => {
        let currentX = rowPositions[index].x;
        let currentY = rowPositions[index].y;
        let lastRow, firstNodeOfLastRow, lastNodeOfLastRow;
        if (index > 0) {
          lastRow = arr[index - 1];
          firstNodeOfLastRow = lastRow[0];
          lastNodeOfLastRow = lastRow[lastRow.length - 1];
        }
        if (index % 2 === 0) {
          for (let i = 0; i < row.length; i++) {
            row[i].x = i === 0 && index !== 0 ? firstNodeOfLastRow.x : currentX;
            currentX = row[i].x + row[i].nodeBaseWidth + pathWidth;
            row[i].y = currentY;
          }
        } else {
          for (let i = row.length - 1; i >= 0; i--) {
            row[i].x =
              i === row.length - 1
                ? lastNodeOfLastRow.x +
                  lastNodeOfLastRow.nodeBaseWidth -
                  row[i].nodeBaseWidth
                : currentX - row[i].nodeBaseWidth;
            currentX = row[i].x - pathWidth;
            row[i].y = currentY;
          }
        }
      });
    },
  });
