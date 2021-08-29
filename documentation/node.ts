import G6 from '@antv/g6';

export const registerNode = () =>
  G6.registerNode(
    'd13n-node',
    {
      drawShape: function drawShape(cfg, group) {
        const color = '#dfdfdf';
        const topRectColor = '#1b75c4';
        const r = 2;
        const shape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 200,
            height: 300,
            stroke: color,
            radius: r,
          },
          name: 'main-box',
          draggable: false,
        });

        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 200,
            height: 20,
            fill: topRectColor,
            stroke: '#fff',
            radius: [r, r, 0, 0],
          },
          name: 'panel-device-name',
        });
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            y: 5,
            x: 2,
            lineHeight: 20,
            text: cfg.title,
            fill: '#fff',
          },
          name: 'text-device-name',
        });
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 20,
            width: 200,
            height: 20,
            fill: topRectColor,
            stroke: '#fff',
            radius: [r, r, 0, 0],
          },
          name: 'text-device-location',
        });
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            y: 25,
            x: 2,
            lineHeight: 20,
            text: cfg.uposition,
            fill: '#fff',
          },
          name: 'text-device-uposition',
        });
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 40,
            width: 200,
            height: 200,
          },
          name: 'panel-device-type-image',
        });
        group.addShape('image', {
          attrs: {
            x: 0,
            y: 40,
            img: 'assets/models/junction-box.jpeg',
            width: 200 - 2,
            height: 200 - 2,
          },
          name: 'image-device-type',
        });
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 240,
            width: 80,
            height: 20,
            stroke: color,
            fill: topRectColor,
          },
          name: 'panel-port-left',
        });
        group.addShape('rect', {
          attrs: {
            x: 120,
            y: 240,
            width: 80,
            height: 20,
            stroke: color,
            fill: topRectColor,
          },
          name: 'panel-port-right',
        });
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            y: 245,
            x: 2,
            lineHeight: 20,
            text: cfg.sPort,
            fill: '#ddd',
          },
          name: 'text-port-left',
        });
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            textAlign: 'right',
            y: 245,
            x: 198, // x=200相当于x=0
            lineHeight: 20,
            text: cfg.dPort,
            fill: '#ddd',
          },
          name: 'text-port-right',
        });
        return shape;
      },
    },
    'single-node'
  );
