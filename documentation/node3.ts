import { registerNode } from '@antv/g6';
import { findSVG } from '@ngux/shared/path-view/utils';
import { isEmpty } from '@opi/util';
import { mix } from '@antv/util';

enum PANEL_COLOR {
  DARK_BLUE = '#004B9E',
  MIDDLE_BLUE = '#B3D7EC',
  LIGHT_BLUE = '#E0EFF8',
}

enum FONT_COLOR {
  WHITE = '#FFFFFF',
  DARK = '#000000',
}

const nodeWidth = 250;
const nodeHeight = 200 + 2;
const panelFontSize = 12;
const panelPortMiddleSpace = 20;
const panelPortWidth = (nodeWidth - panelPortMiddleSpace) / 2;
const panelModelImageHeight = 100;
const panelBaseHeight = 20;
const panelBaseWidth = nodeWidth - 2;
const panelFontColor = FONT_COLOR.WHITE;
const panelFontColorDark = FONT_COLOR.DARK;
const panelFillColor = FONT_COLOR.WHITE;
const panelStrokeColor = FONT_COLOR.WHITE;
const panelBaseFillColor = '#1b75c4';
const panelTextLineHeight = 20;
const panelTextYOffset = panelBaseHeight / 2;
const panelTextIndent = 2;
const containerStrokeColor = '#1b75c4';
const panelTopRectFillColor = PANEL_COLOR.DARK_BLUE;
const panelMiddleRectFillColor = PANEL_COLOR.MIDDLE_BLUE;
const panelBottomRectFillColor = PANEL_COLOR.LIGHT_BLUE;
const r = 2;

export const registerDeviceNode = () =>
  registerNode(
    'd13n-node',
    {
      drawShape: function drawShape(cfg, group) {
        const typeId = cfg.typeId; // '822c1b1a-ced5-11e4-b3c2-000c294c98b1'; // cfg.modelId
        // const style = this.getShapeStyle(cfg);

        const shape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: nodeWidth,
            height: nodeHeight,
            stroke: cfg.hide ? panelStrokeColor : containerStrokeColor,
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
              x: 1,
              y: 1,
              width: panelBaseWidth,
              height: panelBaseHeight,
              fill: panelTopRectFillColor,
              stroke: panelFillColor,
              radius: r,
            },
            name: 'panel-location-info',
          });

          group.addShape('text', {
            attrs: {
              textBaseline: 'middle',
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
              x: 1,
              y: 1 + panelBaseHeight * 1,
              width: panelBaseWidth,
              height: panelBaseHeight,
              fill: panelMiddleRectFillColor,
              stroke: panelStrokeColor,
              radius: r,
            },
            name: 'text-device-location',
          });

          group.addShape('text', {
            attrs: {
              textBaseline: 'middle',
              y: panelBaseHeight * 1 + panelTextYOffset,
              x: panelTextIndent,
              lineHeight: panelTextLineHeight,
              text: cfg.container ?? '',
              fill: panelFontColorDark,
              fontSize: panelFontSize,
            },
            name: 'text-device-uposition',
          });

          // group.addShape('rect', {
          //   attrs: {
          //     x: 0,
          //     y: panelBaseHeight * 2,
          //     width: nodeWidth,
          //     height: panelBaseHeight,
          //     fill: panelBaseFillColor,
          //     stroke: panelStrokeColor,
          //     radius: [r, r, 0, 0],
          //   },
          //   name: 'panel-device-name',
          // });

          group.addShape('text', {
            attrs: {
              textBaseline: 'middle',
              y: panelBaseHeight * 2 + panelTextYOffset,
              x: panelTextIndent * 10,
              lineHeight: panelTextLineHeight,
              text: cfg.deviceName ?? '',
              fill: panelFontColorDark,
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
              y: 1 + panelBaseHeight * 3,
              width: nodeWidth,
              height: panelModelImageHeight,
            },
            name: 'panel-device-type-image',
          });
          // group.addShape('image', {
          //   attrs: {
          //     x: 0,
          //     y: panelBaseHeight * 3,
          //     img: 'assets/models/junction-box.jpeg',
          //     width: nodeWidth,
          //     height: panelModelImageHeight,
          //   },
          // });
          group.addShape('dom', {
            attrs: {
              x: 0,
              y: panelBaseHeight * 3,
              html: findSVG(`ux-${typeId}`),
              width: nodeWidth,
              height: panelModelImageHeight,
            },
          });
          if (cfg.sPort) {
            group.addShape('rect', {
              attrs: {
                x: 1,
                y: 1 + panelBaseHeight * 3 + panelModelImageHeight,
                width: panelPortWidth,
                height: panelBaseHeight,
                stroke: panelStrokeColor,
                fill: panelMiddleRectFillColor,
                radius: r
              },
              name: 'panel-port-left',
            });
            group.addShape('text', {
              attrs: {
                textBaseline: 'middle',
                textAlign: 'center',
                y:
                  panelBaseHeight * 3 +
                  panelModelImageHeight +
                  panelTextYOffset,
                x: panelPortWidth / 2,
                lineHeight: panelTextLineHeight,
                text: cfg.sPort,
                fill: panelFontColorDark,
                fontSize: panelFontSize,
              },
              name: 'text-port-left',
            });
          }
          if (cfg.dPort) {
            group.addShape('rect', {
              attrs: {
                x: panelPortWidth + panelPortMiddleSpace - 1,
                y: 1 + panelBaseHeight * 3 + panelModelImageHeight,
                width: panelPortWidth,
                height: panelBaseHeight,
                stroke: panelStrokeColor,
                fill: panelMiddleRectFillColor,
                radius: r
              },
              name: 'panel-port-right',
            });
            group.addShape('text', {
              attrs: {
                textBaseline: 'middle',
                textAlign: 'center',
                y:
                  panelBaseHeight * 3 +
                  panelModelImageHeight +
                  panelTextYOffset,
                x: nodeWidth - panelPortWidth / 2, // x=200相当于x=0
                lineHeight: panelTextLineHeight,
                text: cfg.dPort,
                fill: panelFontColorDark,
                fontSize: panelFontSize,
              },
              name: 'text-port-right',
            });
          }
          group.addShape('rect', {
            attrs: {
              x: 1,
              y: 1 + panelBaseHeight * 4 + panelModelImageHeight,
              width: panelBaseWidth,
              height: panelBaseHeight,
              fill: panelBottomRectFillColor,
              stroke: panelStrokeColor,
              radius: r,
            },
            name: 'panel-device-type',
          });
          group.addShape('text', {
            attrs: {
              textBaseline: 'middle',
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
