import { registerEdge } from '@antv/g6';

export const registerCableEdge = () => {
  registerEdge(
    'cable-edge',
    {
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
            // fill: rectColor,
            stroke: rectColor,
            x: midPoint.x - 40,
            y: midPoint.y + 20,
          },
        });
        group.addShape('text', {
          attrs: {
            width: 40,
            height: 20,
            fill: rectColor,
            x: midPoint.x - 20,
            y: midPoint.y - 20,
            text: cfg.info,
          },
        });
        return group as any;
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
