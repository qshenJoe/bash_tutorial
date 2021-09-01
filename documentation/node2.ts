import { registerNode } from '@antv/g6';
enum PANEL_COLOR {
  LIGHT_BLUE = '#d5e7f4',
  DARK_BLUE = '#025ab2',
  GREY = '#ddd',
}

export const registerDeviceNode = () =>
  registerNode(
    'd13n-node',
    {
      drawShape: function drawShape(cfg, group) {
        const color = '#dfdfdf';
        const topRectColor = '#1b75c4';
        const bottomRectColor = PANEL_COLOR.GREY;
        const r = 2;
        const shape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 150,
            height: 180,
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
            width: 150,
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
            width: 150,
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
            width: 150,
            height: 100,
          },
          name: 'panel-device-type-image',
        });
        group.addShape('image', {
          attrs: {
            x: 0,
            y: 40,
            img: 'assets/models/junction-box.jpeg',
            width: 150 - 2,
            height: 100 - 2,
          },
          name: 'image-device-type',
        });
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 140,
            width: 65,
            height: 20,
            stroke: color,
            fill: topRectColor,
          },
          name: 'panel-port-left',
        });
        group.addShape('rect', {
          attrs: {
            x: 85,
            y: 140,
            width: 65,
            height: 20,
            stroke: color,
            fill: topRectColor,
          },
          name: 'panel-port-right',
        });
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            y: 145,
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
            y: 145,
            x: 148, // x=200相当于x=0
            lineHeight: 20,
            text: cfg.dPort,
            fill: '#ddd',
          },
          name: 'text-port-right',
        });
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 160,
            width: 150,
            height: 20,
            fill: bottomRectColor,
          },
          name: 'panel-device-type',
        });
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            textAlign: 'center',
            y: 165,
            x: 77,
            lineHeight: 20,
            text: cfg.deviceType,
            fill: '#000',
          },
          name: 'text-device-type',
        });
        return shape;
      },
    },
    'single-node'
  );
