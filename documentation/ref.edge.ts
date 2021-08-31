import { Util, registerEdge } from '@antv/g6';
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

const NETWORK_CABLE_TYPE = {
  totalCount: null,
  copperCount: 'Copper Cable',
  fiberCount: 'Fiber Cable',
  storageCount: 'Storage Cable',
};
// start,end 倒置，center 不变
function revertAlign(labelPosition: string) {
  let textAlign = labelPosition;
  if (labelPosition === 'start') {
    textAlign = 'end';
  } else if (labelPosition === 'end') {
    textAlign = 'start';
  }
  return textAlign;
}
const CLS_SHAPE = 'edge-cable-shape';
const CLS_B_SHAPE = 'edge-cable-brush-shape';

export const registerCableEdge = (commonStatus?: object) => {
  registerEdge('cable', {
    options: {
      stateStyles: {
        hover: {
          lineWidth: 3,
        },
        selected: {
          lineWidth: 5,
        },
        a: {
          color: '#abcdef',
        } as any,
        b: {
          color: '#000000',
        } as any,
      },
    },
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
      const isHorizontal = ['LR', 'RL'].includes(cfg.direction as string);

      const Ydiff = endPoint.y - startPoint.y;

      // const Xdiff = endPoint.x - startPoint.x;
      // const offset = Ydiff < 0 ? length : -length;

      let path = [
        ['M', startPoint.x, startPoint.y],
        ['L', endPoint.x, endPoint.y],
      ];

      const idx = sourceNode.anchorIdx || 0;
      if (
        sourceAnchorPoints.length > 2 &&
        sourceAnchor !== 0 &&
        sourceAnchor < sourceAnchorPoints.length - 1 &&
        targetAnchorPoints.length > 2 &&
        targetAnchor !== 0 &&
        targetAnchor < targetAnchorPoints.length - 1
      ) {
        targetNode.anchorIdx = targetNode.anchorIdx || idx + 1;
        const tag = 10 * (idx + sourceAnchorPoints.length - sourceAnchor - 1);

        if (!isHorizontal) {
          if (Ydiff < 5) {
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x + tag, startPoint.y],
              ['L', endPoint.x + tag, endPoint.y],
              ['L', endPoint.x, endPoint.y],
            ];
          } else {
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', startPoint.x + tag, startPoint.y],
              ['L', startPoint.x + tag, endPoint.y],
              ['L', endPoint.x, endPoint.y],
            ];
          }
        } else {
          if (Ydiff < 5) {
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', startPoint.x, startPoint.y + tag],
              ['L', endPoint.x, startPoint.y + tag],
              ['L', endPoint.x, endPoint.y],
            ];
          } else {
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', startPoint.x, endPoint.y + tag],
              ['L', endPoint.x, endPoint.y + tag],
              ['L', endPoint.x, endPoint.y],
            ];
          }
          if (tag === Ydiff) {
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', startPoint.x, startPoint.y + tag],
              ['L', endPoint.x, endPoint.y],
              ['L', endPoint.x, endPoint.y],
            ];
          }
        }
      }

      const brushColor = getValue(cfg, ['data', cfg.brushKey]);
      if (brushColor) {
        const lineBrush = group.addShape('path', {
          attrs: {
            path: path,
            stroke: brushColor,
            strokeOpacity: 0.5,
            lineWidth: 12,
            endArrow: false,
            visible: false,
          },
        });
        lineBrush.set('className', CLS_B_SHAPE);
        lineBrush.hide();
      }

      const line = group.addShape('path', {
        attrs: {
          path: path,
          stroke:
            getValue(cfg, [
              'data',
              getValue(commonStatus, 'sideColor') || 'color',
            ]) || '#000000', // colorMap[cfg.data.type],
          lineWidth: 6,
          endArrow: false,
        },
      });
      line.set('className', CLS_SHAPE);

      const labelTopOffset = 8;
      if (cfg.data) {
        const { count } = cfg.data as any;
        const countKey = getValue(commonStatus, 'count');
        cfg.category = NETWORK_CABLE_TYPE[getValue(commonStatus, 'count')];

        if (count) {
          cfg.labelCfg = {
            refY: 10,
            style: {
              text: `×${
                countKey ? getValue(cfg, ['data', countKey]) || 0 : count.value
              }`,
              // x: startPoint.x + Xdiff / 8,
              // y: centerPoint.y - Ydiff / 8 - (labelTopOffset + 2),
              fontSize: 18,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000D9',
              cursor: 'pointer',
            } as any,
          };

          // this.drawLabel(cfg, group);
          // const constText = group.addShape('text', {
          //   attrs:
          // });
        }
      }

      return line;
    },
    drawLabel(cfg, group) {
      if (!(group && group.findByClassName)) {
        return;
      }
      let countLabel =
        group.findByClassName('edge-text-count') ||
        group.findByClassName('edge-text-disabled');
      // tslint:disable-next-line: no-unused-expression
      // countLabel && group.removeChild(countLabel, true);
      // countLabel && countLabel.remove();
      // const customStyle = this.getCustomConfig(cfg) || {};
      // const defaultConfig = customStyle.default || {};
      const defaultConfig = {} as any;
      const labelCfg = deepMix(
        {},
        this.options.labelCfg,
        defaultConfig.labelCfg,
        cfg.labelCfg
      );
      const style = this.getLabelStyleByPosition(cfg, labelCfg, group);
      // const labelStyle = this.getLabelStyle(cfg, labelCfg, group);
      // cursor: "pointer"
      let countData = [];
      let count = {};
      if (cfg.data) {
        count = getValue(cfg, ['data', 'count', 'data']);
        if (count) {
          countData = getValue(count, ['table', 'data']) || [];
          if (cfg.category) {
            countData = [...countData].filter(
              item => item.category === cfg.category
            );
          }
        }
      }
      const disabled = isEmpty(countData);
      if (disabled) {
        style.cursor = 'default';
      }
      if (countLabel) {
        // countLabel.set('attrs', { ...labelCfg, ...style });
        countLabel['attrs'] = {
          ...countLabel['attrs'],
          ...{ ...labelCfg, ...style },
        };
      } else {
        countLabel = group.addShape('text', {
          attrs: { ...labelCfg, ...style },
        });
      }
      countLabel.set(
        'dataSource',
        setValue(count, countData, ['table', 'data'])
      );
      countLabel.set(
        'className',
        disabled ? 'edge-text-disabled' : 'edge-text-count'
      );
      // label.resetMatrix();
      return countLabel as any;
    },
    afterDraw: function (cfg, group) {
      const self = this;
      // const shapeFactory = self.get('shapeFactory');
      group = group || self.get('group');
      const model = cfg || self.get('model');
      this.drawLabel(model, group);
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
    _getTextAlign(labelPosition: string, angle: number) {
      let textAlign = 'center';
      if (!angle) {
        return labelPosition;
      }
      angle = angle % (Math.PI * 2); // 取模
      if (labelPosition !== 'center') {
        if (
          (angle >= 0 && angle <= Math.PI / 2) ||
          (angle >= (3 / 2) * Math.PI && angle < 2 * Math.PI)
        ) {
          textAlign = labelPosition;
        } else {
          textAlign = revertAlign(labelPosition);
        }
      }
      return textAlign;
    },
    setState(name: string, value: boolean, item: any) {
      const shape = item.get('keyShape');
      if (!shape) {
        return;
      }
      const self = item.getModel();

      const group = item.get('group') || item._cfg.group; // item._cfg.group;
      if (name === 'cableBrush') {
        const pathShape = group.findByClassName(CLS_B_SHAPE);
        nextTick(() => {
          if (pathShape) {
            value ? pathShape.show() : pathShape.hide();
          }
        });
        return;
      }

      if (name.toLowerCase().includes('count')) {
        const category = NETWORK_CABLE_TYPE[name];
        const count = getValue(self, ['data', name]) || 0;
        const labelCfg = {
          ...self.labelCfg,
          style: {
            ...self.labelCfg.style,
            text: `×${count}`,
          },
        };
        const cfg = Object.assign(self, { labelCfg, category });

        if (value) {
          this.drawLabel(cfg, group);
          const pathShape = group.findByClassName(CLS_SHAPE);
          pathShape.attr({ strokeOpacity: count === 0 ? 0.1 : 1 });
        }
        return;
      }
      const itemStateStyle = {
        stroke:
          getValue(self, ['data', getValue(commonStatus, 'sideColor')]) ||
          '#000000',
      }; // item.getStateStyle(name);
      const stateStyle = {}; // this.getStateStyle(name, value, item);
      const styles = extendObject({}, stateStyle, itemStateStyle);
      shape.attr(styles);
      // if (value) {
      //   // 如果设置状态,在原本状态上叠加绘图属性
      //   shape.attr(styles);
      // } else {
      //   // 取消状态时重置所有状态，依次叠加仍有的状态
      //   const style = item.getCurrentStatesStyle();
      //   // 如果默认状态下没有设置attr，在某状态下设置了，需要重置到没有设置的状态
      //   Util.each(styles, (val, attr) => {
      //     if (!style[attr]) {
      //       style[attr] = null;
      //     }
      //   });
      //   shape.attr({
      //     ...style,
      //     stroke:
      //       getValue(self, [
      //         'data',
      //         getValue(commonStatus, 'sideColor') || 'color'
      //       ]) || '#000000'
      //   });
      // }
      // console.log('--cable-state->', name, value, item);
    },
  });
};
