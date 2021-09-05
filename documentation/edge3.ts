import G6, { registerEdge, Util } from '@antv/g6';
import { deepMix } from '@antv/util';

enum COLORS {
  CABLE_TEXT_BG = '#f2f2f2',
  TEXT = '#000',
  BLUE = '#004B9E',
}
const edgeSep = 80;
const arrowWidth = 20;
const arrowHeight = 12;
const CLS_SHAPE = 'edge-shape';

const NAME_CABLE = 'cable-path-main';
const NAME_CABLE_LABEL = 'cable-path-label';
const NAME_CABLE_END = 'cable-path-end';

export const registerCableEdge = () => {
  registerEdge(
    'cable-edge',
    {
      draw: function draw(cfg, group) {
        const self = this;
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;

        const isRealCable = cfg.cableType === 'R';
        const sourceNode: any = cfg.sourceNode;
        const position = sourceNode.get('model')?.position;
        const dY = endPoint.y - startPoint.y;
        let path = [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x, endPoint.y],
        ];
        // console.log('Cable Length', endPoint.x - startPoint.x);
        if (position === 'L') {
          path = [
            ['M', startPoint.x, startPoint.y],
            ['L', startPoint.x + edgeSep, startPoint.y],
            ['L', startPoint.x + edgeSep, startPoint.y + dY],
            ['L', endPoint.x, endPoint.y],
          ];
        } else if (position === 'F') {
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
            lineWidth: isRealCable ? 8 : 3,
            cursor: 'pointer',
          },
          name: NAME_CABLE,
        });
        line.set('className', CLS_SHAPE);
        return line;
      },
      drawLabel(cfg, group) {
        const sourceNode: any = cfg.sourceNode;
        const sourceModel = sourceNode.get('model');
        const targetNode: any = cfg.targetNode;
        const targetModel = targetNode.get('model');
        const position = targetNode.get('model')?.position;
        const isRealCable = cfg.cableType === 'R';
        let cableLabel = group.findByClassName('edge-cable-text');
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const shape = group.get('children')[0];
        const midPoint = shape.getPoint(0.5) || { x: 0, y: 0 };
        const rectColor = '#dfdfdf';
        if (isRealCable) {
          // add start arrow and end arrow
          const startX = this.calcArrowOffset(
            cfg,
            true,
            position,
            sourceModel,
            targetModel
          );
          // console.log('sx', startX);
          group.addShape('rect', {
            attrs: {
              width: arrowWidth,
              height: arrowHeight,
              fill: COLORS.CABLE_TEXT_BG,
              stroke: rectColor,
              x: startX,
              y: startPoint.y - (1 / 2) * arrowHeight,
            },
            name: NAME_CABLE_END,
          });
          const endX = this.calcArrowOffset(
            cfg,
            false,
            position,
            sourceModel,
            targetModel
          );
          // console.log('ex', endX);
          group.addShape('rect', {
            attrs: {
              width: arrowWidth,
              height: arrowHeight,
              fill: COLORS.CABLE_TEXT_BG,
              stroke: rectColor,
              x: endX,
              y: endPoint.y - (1 / 2) * arrowHeight,
            },
            name: NAME_CABLE_END,
          });
        }
        const defaultConfig = {} as any;
        const labelCfg = deepMix(
          {},
          this.options.labelCfg,
          defaultConfig.labelCfg,
          cfg.labelCfg
        );
        const cableInfoPosX = midPoint.x;
        const cableInfoPosY = midPoint.y;
        const dY = endPoint.y - startPoint.y;
        const targetY = startPoint.y + dY / 3;

        const style = this.getLabelStyleByPosition(cfg, labelCfg, group);
        if (isRealCable) {
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
                ...this.calcLabelOffset(cfg, group),
                text: cfg.label,
                textAlign: 'start',
                textBaseline: 'middle',
              },
              name: NAME_CABLE_LABEL,
            });
          }
          cableLabel.set('className', `${CLS_SHAPE}_label`);
          this.drawLabelBg(cfg, group, cableLabel);
          cableLabel.toFront();
        }
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
      calcArrowOffset(cfg, start, position, sourceModel, targetModel) {
        const direction = cfg.direction;
        const reverse = cfg.odd ?? false;
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        if (start) {
          if (sourceModel.rowNum % 2 === 0) {
            return startPoint.x;
          } else {
            return startPoint.x - arrowWidth;
          }
        } else {
          if (targetModel.rowNum % 2 === 0) {
            return endPoint.x - arrowWidth;
          } else {
            return endPoint.x;
          }
        }
      },
      calcLabelOffset(cfg, group) {
        const sPosition = cfg.sourceNode.get('model').position;
        const tPosition = cfg.targetNode.get('model').position;
        const shape = group.get('children')[0];
        const midPoint = shape.getPoint(0.5);
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const dY = endPoint.y - startPoint.y;
        const offsetY = startPoint.y + dY / 3;
        const offsetX = startPoint.x - 40;
        if (tPosition === 'L' || tPosition === 'F' || sPosition == null) {
          return {
            x: midPoint.x - 40,
            y: midPoint.y + 80,
          };
        } else {
          return {
            x: offsetX,
            y: offsetY,
          };
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
        const autoRotate =
          labelCfg.autoRotate == null
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
      setState(name, value, item) {
        const group = item.getContainer();
        const shape = group
          .get('children')
          .find((_) => _.get('name') === NAME_CABLE);
        // if (name === 'active') {
        //   if (value) {
        //     shape.attr('cursor', 'pointer');
        //   } else {
        //     shape.attr('cursor', 'default');
        //   }
        // }
        if (name === 'selected') {
          if (value) {
            shape.attr('lineWidth', 20);
          } else {
            shape.attr('lineWidth', 8);
          }
        }
      },
    },
    'polyline'
  );
};
