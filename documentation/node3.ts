import { registerNode } from '@antv/g6';
import { mix } from '@antv/util';

enum PANEL_COLOR {
  LIGHT_BLUE = '#d5e7f4',
  DARK_BLUE = '#025ab2',
  GREY = '#ddd',
}

const nodeWidth = 250;
const nodeHeight = 200;
const panelFontSize = 12;
const panelPortMiddleSpace = 20;
const panelPortWidth = (nodeWidth - panelPortMiddleSpace) / 2;
const panelModelImageHeight = 100;
const panelBaseHeight = 20;
const panelFontColor = '#fff';
const panelFontColorDark = '#000';
const panelFillColor = '#fff';
const panelStrokeColor = '#fff';
const panelBaseFillColor = '#1b75c4';
const panelTextLineHeight = 20;
const panelTextYOffset = 5;
const panelTextIndent = 2;
export const registerDeviceNode = () =>
  registerNode(
    'd13n-node',
    {
      drawShape: function drawShape(cfg, group) {
        const color = '#dfdfdf';
        const bottomRectColor = PANEL_COLOR.GREY;
        const r = 2;
        const typeId = '822c1b1a-ced5-11e4-b3c2-000c294c98b1'; // cfg.modelId
        // const style = this.getShapeStyle(cfg);

        const shape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: nodeWidth,
            height: nodeHeight,
            stroke: cfg.hide ? panelStrokeColor : color,
            radius: r,
          },
          name: 'main-box',
          draggable: false,
        });
        if (!cfg.hide) {
          /**
           * Add Shape Device Name Panel and Text
           */

          group.addShape('rect', {
            attrs: {
              x: 0,
              y: 0,
              width: nodeWidth,
              height: panelBaseHeight,
              fill: panelBaseFillColor,
              stroke: panelFillColor,
              radius: [r, r, 0, 0],
            },
            name: 'panel-location-info',
          });

          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              y: panelTextYOffset,
              x: panelTextIndent,
              lineHeight: panelTextLineHeight,
              text: cfg.location ?? '',
              fill: panelFontColor,
              fontSize: panelFontSize,
            },
            name: 'text-location-info',
          });

          /**
           * Add Shape Device Container Panel and Text
           */
          group.addShape('rect', {
            attrs: {
              x: 0,
              y: panelBaseHeight * 1,
              width: nodeWidth,
              height: panelBaseHeight,
              fill: panelBaseFillColor,
              stroke: panelStrokeColor,
              radius: [r, r, 0, 0],
            },
            name: 'text-device-location',
          });

          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              y: panelBaseHeight * 1 + panelTextYOffset,
              x: panelTextIndent,
              lineHeight: panelTextLineHeight,
              text: cfg.container ?? '',
              fill: panelFontColor,
              fontSize: panelFontSize,
            },
            name: 'text-device-uposition',
          });

          group.addShape('rect', {
            attrs: {
              x: 0,
              y: panelBaseHeight * 2,
              width: nodeWidth,
              height: panelBaseHeight,
              fill: panelBaseFillColor,
              stroke: panelStrokeColor,
              radius: [r, r, 0, 0],
            },
            name: 'panel-device-name',
          });

          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              y: panelBaseHeight * 2 + panelTextYOffset,
              x: panelTextIndent,
              lineHeight: panelTextLineHeight,
              text: cfg.deviceName ?? '',
              fill: panelFontColor,
              fontSize: panelFontSize,
            },
            name: 'text-device-name',
          });

          /**
           * Add Shape Device Type Image
           */
          group.addShape('rect', {
            attrs: {
              x: 0,
              y: panelBaseHeight * 3,
              width: nodeWidth,
              height: panelModelImageHeight,
              stroke: '#1b75c4',
            },
            name: 'panel-device-type-image',
          });
          group.addShape('image', {
            attrs: {
              x: 0,
              y: panelBaseHeight * 3,
              img: 'assets/models/junction-box.jpeg',
              width: nodeWidth,
              height: panelModelImageHeight,
            },
          });
          // group.addShape('img', {
          //   attrs: {
          //     x: 0,
          //     y: 40,
          //     html: findSVG(`ux-${typeId}`),
          //     width: 150 - 2,
          //     height: 100 - 2,
          //   },
          // });
          if (cfg.sPort) {
            group.addShape('rect', {
              attrs: {
                x: 0,
                y: panelBaseHeight * 3 + panelModelImageHeight,
                width: panelPortWidth,
                height: panelBaseHeight,
                stroke: color,
                fill: panelBaseFillColor,
              },
              name: 'panel-port-left',
            });
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                y:
                  panelBaseHeight * 3 +
                  panelModelImageHeight +
                  panelTextYOffset,
                x: 2,
                lineHeight: panelTextLineHeight,
                text: cfg.sPort,
                fill: panelFontColor,
                fontSize: panelFontSize,
              },
              name: 'text-port-left',
            });
          }
          if (cfg.dPort) {
            group.addShape('rect', {
              attrs: {
                x: panelPortWidth + panelPortMiddleSpace,
                y: panelBaseHeight * 3 + panelModelImageHeight,
                width: panelPortWidth,
                height: panelBaseHeight,
                stroke: color,
                fill: panelBaseFillColor,
              },
              name: 'panel-port-right',
            });
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                textAlign: 'right',
                y:
                  panelBaseHeight * 3 +
                  panelModelImageHeight +
                  panelTextYOffset,
                x: nodeWidth - 2, // x=200相当于x=0
                lineHeight: panelTextLineHeight,
                text: cfg.dPort,
                fill: panelFontColor,
                fontSize: panelFontSize,
              },
              name: 'text-port-right',
            });
          }
          group.addShape('rect', {
            attrs: {
              x: 0,
              y: panelBaseHeight * 4 + panelModelImageHeight,
              width: nodeWidth,
              height: panelBaseHeight,
              fill: bottomRectColor,
            },
            name: 'panel-device-type',
          });
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              textAlign: 'center',
              y: panelBaseHeight * 4 + panelModelImageHeight + panelTextYOffset,
              x: nodeWidth / 2,
              lineHeight: panelTextLineHeight,
              text: cfg.deviceType,
              fill: panelFontColorDark,
              fontSize: panelFontSize,
            },
            name: 'text-device-type',
          });
          // if (style.img || style.html) {
          //   group.addShape(style.html ? 'dom' : 'image', {
          //     attrs: { ...style, style: 'pointer-events: none;' }, // { pointerEvents: 'none' }
          //   });
          // }
        }
        return shape;
      },
    },
    'single-node'
  );
