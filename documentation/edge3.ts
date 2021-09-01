import G6, { registerEdge, Util } from '@antv/g6';
import {
  extendObject,
  getValue,
  isEmpty,
  isFunction,
  setValue,
  isNil,
  nextTick,
} from '@opi/util';
import { deepMix } from '@antv/util';

enum COLORS {
  CABLE_TEXT_BG = '#f2f2f2',
  TEXT = '#000',
}
const edgeSep = 80;
const arrowWidth = 28;
const arrowHeight = 12;
const CLS_SHAPE = 'edge-cable-shape';

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
        if (cfg.direction === 'RDL') {
          path = [
            ['M', startPoint.x, startPoint.y],
            ['L', startPoint.x + edgeSep, startPoint.y],
            ['L', startPoint.x + edgeSep, startPoint.y + dY],
            ['L', endPoint.x, endPoint.y],
          ];
        } else if (cfg.direction === 'LDR') {
          path = [
            ['M', startPoint.x, startPoint.y],
            ['L', startPoint.x - edgeSep, startPoint.y],
            ['L', startPoint.x - edgeSep, startPoint.y + dY],
            ['L', endPoint.x, endPoint.y],
          ];
        }
        const line = group.addShape('path', {
          attrs: {
            path,
            stroke: (cfg.cableColor as string) || '#dfdfdf',
            lineWidth: 8,
            // startArrow: {
            //   path: 'M 0,-5 L 0,5 L 30,5 L 30,-5 Z',
            //   stroke: '#F6BD16',
            // },
            // endArrow: {
            //   path: 'M 0,-5 L 0,5 L 30,5 L 30,-5 Z',
            //   stroke: '#F6BD16',
            // },
          },
        });
        line.set('className', CLS_SHAPE);
        return line;
      },
      drawLabel(cfg, group) {
        let cableLabel = group.findByClassName('edge-cable-text');
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const shape = group.get('children')[0];
        const midPoint = shape.getPoint(0.5);
        const rectColor = '#dfdfdf';
        // group.addShape('rect', {
        //   attrs: {
        //     width: 80,
        //     height: 60,
        //     fill: COLORS.CABLE_TEXT_BG,
        //     stroke: rectColor,
        //     x: midPoint.x - 40,
        //     y: midPoint.y + 20,
        //     r: 2,
        //   },
        // });

        // add start arrow and end arrow
        group.addShape('rect', {
          attrs: {
            width: arrowWidth,
            height: arrowHeight,
            fill: COLORS.CABLE_TEXT_BG,
            stroke: rectColor,
            x: this.calcArrowOffset(cfg, true),
            y: startPoint.y - (1 / 2) * arrowHeight,
          },
        });
        group.addShape('rect', {
          attrs: {
            width: arrowWidth,
            height: arrowHeight,
            fill: COLORS.CABLE_TEXT_BG,
            stroke: rectColor,
            x: this.calcArrowOffset(cfg, false),
            y: endPoint.y - (1 / 2) * arrowHeight,
          },
        });
        // group.addShape('text', {
        //   attrs: {
        //     fill: COLORS.TEXT,
        //     x: midPoint.x - 40,
        //     y: midPoint.y + 40,
        //     text: cfg.label,
        //     textAlign: 'start',
        //     textBaseline: 'middle',
        //     style: {
        //       background: {
        //         fill: '#dfdfdf',
        //         stroke: '#fff',
        //         padding: [3, 2, 3, 2],
        //       },
        //     },
        //   },
        //   className: 'cable-text-shape',
        //   name: 'cable-text-shape',
        // });
        const defaultConfig = {} as any;
        const labelCfg = deepMix(
          {},
          this.options.labelCfg,
          defaultConfig.labelCfg,
          cfg.labelCfg
        );
        const style = this.getLabelStyleByPosition(cfg, labelCfg, group);
        if (cableLabel) {
          cableLabel['attrs'] = {
            ...cableLabel['attrs'],
            ...{ ...labelCfg, ...style },
          };
        } else {
          cableLabel = group.addShape('text', {
            attrs: {
              ...labelCfg,
              ...style,
              text: cfg.label,
              textAlign: 'start',
              textBaseline: 'middle',
            },
          });
        }
        cableLabel.set('className', 'edge-text-count');
        // add label bgColor
        // const rect = this.drawLabelBg(cfg, group, label);
        // const labelBgClassname = this.itemType + '-label-bg';
        // rect.set('classname', labelBgClassname);
        // label.toFront();
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
      calcArrowOffset(cfg, start) {
        const direction = cfg.direction;
        const reverse = cfg.odd ?? false;
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        if (start) {
          return reverse ? startPoint.x - arrowWidth : startPoint.x;
        } else {
          return direction === 'RDL' || reverse
            ? endPoint.x
            : endPoint.x - arrowWidth;
        }
      },
      getLabelStyleByPosition(cfg, labelCfg, group) {
        const labelPosition = labelCfg.position || this.labelPosition; // 文本的位置用户可以传入
        const style: any = labelCfg.style || {};
        const pathShape = group.findByClassName(CLS_SHAPE);
        // 不对 pathShape 进行判空，如果线不存在，说明有问题了
        let pointPercent;
        if (labelPosition === 'start') {
          pointPercent = 0;
        } else if (labelPosition === 'end') {
          pointPercent = 1;
        } else {
          pointPercent = 0.2;
        }
        const { refX, refY } = labelCfg; // 默认的偏移量
        // 如果两个节点重叠，线就变成了一个点，这时候label的位置，就是这个点 + 绝对偏移
        if (
          cfg.startPoint.x === cfg.endPoint.x &&
          cfg.startPoint.y === cfg.endPoint.y
        ) {
          style.x = cfg.startPoint.x + refX ? refX : 0;
          style.y = cfg.endPoint.y + refY ? refY : 0;
          return style;
        }
        const autoRotate = isNil(labelCfg.autoRotate)
          ? this.labelAutoRotate
          : labelCfg.autoRotate;
        const offsetStyle = Util.getLabelPosition(
          pathShape as any,
          pointPercent,
          refX,
          refY,
          autoRotate
        );
        style.x = offsetStyle.x;
        style.y = offsetStyle.y;
        style.rotate = offsetStyle.rotate;
        style.textAlign = this._getTextAlign(labelPosition, offsetStyle.angle);
        return style;
      }, // 获取文本对齐方式
      update: undefined,
    },
    'polyline'
  );
};
