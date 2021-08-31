import G6, { registerEdge } from '@antv/g6';

enum COLORS {
  CABLE_TEXT_BG = '#f2f2f2',
  TEXT = '#000',
}

export const registerCableEdge = () => {
  registerEdge(
    'cable-edge',
    {
      draw: function draw(cfg, group) {
        const self = this;
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const centerPoint = {
          x: (startPoint.x + endPoint.x) / 2,
          y: (startPoint.y + endPoint.y) / 2,
        };
        const sourceNode: any = cfg.sourceNode;
        const targetNode: any = cfg.targetNode;
        const sourceAnchorPoints = sourceNode.getAnchorPoints();
        const sourceAnchor = cfg.sourceAnchor as number;
        const targetAnchorPoints = targetNode.getAnchorPoints();
        const targetAnchor = cfg.targetAnchor;
        const isVertical = ['RDL', 'LDR'].includes(cfg.direction as string);
        const dY = endPoint.y - startPoint.y;
        let path = [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x, endPoint.y],
        ];
        return line;
      },
      drawLabel(cfg, group) {
        const shape = group.get('children')[0];
        const midPoint = shape.getPoint(0.5);
        const rectColor = '#dfdfdf';
        console.log(`
          target anchor: ${cfg.targetAnchor},
          source anchor: ${cfg.sourceAnchor},
          x: ${midPoint.x},
          y: ${midPoint.y}
        `);
        group.addShape('rect', {
          attrs: {
            width: 80,
            height: 60,
            fill: COLORS.CABLE_TEXT_BG,
            stroke: rectColor,
            x: midPoint.x - 40,
            y: midPoint.y + 20,
            r: 2,
          },
        });
        group.addShape('text', {
          attrs: {
            fill: COLORS.TEXT,
            x: midPoint.x - 40,
            y: midPoint.y + 40,
            text: cfg.info,
            textAlign: 'start',
            textBaseline: 'middle',
          },
        });
        return group as any;
      },
      getPath(points) {
        const [startPoint, endPoint] = points;
        return [
          [
            ['M', startPoint.x, startPoint.y],
            ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
            ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
            ['L', startPoint.x, startPoint.y],
          ],
        ];
      },
      getShapeStyle(cfg) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const controlPoints = this.getControlPoints(cfg);
        let points = [startPoint]; // the start point
        // the control points
        if (controlPoints) {
          points = points.concat(controlPoints);
        }
        points.push(endPoint);
        const path = this.getPath(points);
        const style = Object.assign(
          {},
          G6.Global.defaultEdge.style,
          {
            stroke: '#BBB',
            lineWidth: 1,
            path,
          },
          cfg.style
        );
        return style;
      },
      afterDraw: function (cfg, group) {
        const self = this;
        group = group || self.get('group');
        const model = cfg || self.get('model');
        this.drawLabel(model, group);
      },
      update: undefined,
    },
    'polyline'
  );
};
